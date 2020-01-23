//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//


/** 
 * Collects PeopleCount analystics from a collection of RoomKits
 * with a moving window interval
 */


const debug = require("debug")("collector");
const fine = require("debug")("collector:fine");


// Connects to a Room Device
const jsxapi = require("jsxapi");
function connect(device) {
    return new Promise(function (resolve, reject) {

        // Connect via SSH
        const xapi = jsxapi.connect(`ssh://${device.ipAddress}`, {
            username: device.username,
            password: device.password
        });
        xapi.on('error', (err) => {
            debug(`connexion failed for device: ${device.id}, ip address: ${device.ipAddress}, with err: ${err}`)
            reject(err)
        });
        xapi.on('ready', () => {
            fine(`connexion successful for device: ${device.id}`);
            resolve(xapi);
        });
    });
}

// Time series storage
const stores = {};
function createStore(device) {
    stores[device.id] = [];
}
function addCounter(device, date, count) {
    fine(`adding count: ${count}, for device: ${device.id}`)

    const store = stores[device.id];
    store.push([date.toISOString(), count]);
}


// Initialize listeners for each device
const devices = require("./devices.json");
devices.forEach(device => {

    fine(`connecting to device: ${device.id}`)
    connect(device)

        .then(xapi => {
            debug(`connected to device: ${device.id}`);

            // Check devices can count
            xapi.status
                .get('RoomAnalytics PeopleCount')
                .then((counter) => {
                    fine(`fetched PeopleCount for device: ${device.id}`);

                    // Abort if device does not count
                    var count = counter.Current;
                    if (count == -1) {
                        debug(`device is not counting: ${device.id}`);
                        return;
                    }

                    // Store first TimeSeries
                    createStore(device);
                    addCounter(device, new Date(Date.now()), count);

                    // Listen to events
                    fine(`adding feedback listener to device: ${device.id}`);
                    xapi.feedback.on('/Status/RoomAnalytics/PeopleCount', (counter) => {
                        fine(`new PeopleCount: ${counter.Current}, for device: ${device.id}`);

                        // fetch PeopleCount value
                        var count = parseInt(counter.Current); // turn from string to integer
                        if (count == -1) {
                            debug(`WARNING: device '${device.id}' has stopped counting`);
                            return;
                        }

                        // register new TimeSeries
                        addCounter(device, new Date(Date.now()), count);
                    });

                })
                .catch((err) => {
                    debug(`Failed to retrieve PeopleCount status for device: ${device.id}, err: ${err.message}`);
                    console.log(`Please check your configuration: seems that '${device.id}' is NOT a Room device.`);
                    xapi.close();
                });
        })
        .catch(err => {
            debug(`Could not connect device: ${device.id}`)
        })
});


// 
// Clean TimeSeries 
//

// Collect interval (moving window of collected time series)
var window = process.env.WINDOW ? process.env.WINDOW : 15 * 60; // in seconds 
debug(`collecting window: ${window} seconds`);

// Individual store cleaner
function cleanStore(store) {
    const oldest = Date.now() - window*1000; 
    
    const lowestDate = new Date(oldest).toISOString();
    store.forEach(serie => {
        if (serie[0] < lowestDate) {
            store.shift()
        }
    });
}

// Dump time series in a store
function dumpSeries(store) {
    store.forEach(serie => {
            fine(`time: ${serie[0]}, count: ${serie[1]}`);
    });
}

// Run cleaner
setInterval(function () {
    Object.keys(stores).forEach((key) => {
        fine(`cleaning TimeSeries for device: ${key}`);

        const store = stores[key];
        cleanStore(store);

        if ("production" !== process.env.NODE_ENV) {
            fine(`dumping stored series for device: ${key}`);
            dumpSeries(store);
        }
    })
}, window * 1000); // in milliseconds


//
// Return people count for the device and averaged on the period (in seconds)
//

const { computeBarycentre } = require("./util/barycentre");

module.exports.averageOnPeriod = function (device, period) {
    fine(`searching store for device: ${device}`);

    const store = stores[device];
    if (!store) {
        fine(`could not find store for device: ${device}`);
        return undefined;
    }

    fine(`found store for device: ${device}`);

    // Compute average
    const to = new Date(Date.now()).toISOString();
    const from = new Date(Date.now() - period*1000).toISOString();
    const avg = computeBarycentre(store, from, to);
    fine(`computed avg: ${avg}, over last: ${period} seconds, for device: ${device}`);

    return avg;
}

module.exports.latest = function (device) {
    fine(`searching store for device: ${device}`);
    const store = stores[device];
    if (!store) {
        fine(`could not find store for device: ${device}`);
        return undefined;
    }
    fine(`found store for device: ${device}`);

    // Looking for last serie
    const lastSerie = store[store.length - 1];
    fine(`found last serie with value: ${lastSerie[1]}, date: ${lastSerie[0]}, for device: ${device}`);

    return lastSerie[1];
}

const { max } = require("./util/max");

module.exports.max = function (device) {
    fine(`searching store for device: ${device}`);
    const store = stores[device];
    if (!store) {
        fine(`could not find store for device: ${device}`);
        return undefined;
    }
    fine(`found store for device: ${device}`);

    // Looking for max value in series
    const to = new Date(Date.now()).toISOString();
    const from = new Date(Date.now() - period*1000).toISOString();
    const maxSerie = computeMax(store, from, to);

    fine(`found max value: ${maxSerie[1]}, date: ${maxSerie[0]}, for device: ${device}`);

    return maxSerie;
}
