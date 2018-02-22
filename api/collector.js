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
        const xapi = jsxapi.connect(`ssh://${device.ip}`, {
            username: device.username,
            password: device.password
        });
        xapi.on('error', (err) => {
            debug(`connexion failed: ${err}`)
            reject(err)
        });
        xapi.on('ready', () => {
            fine("connexion successful");
            resolve(xapi);
        });
    });
}

// Time series storage
const stores = {};
function createStore(device) {
    stores[device.name] = [];
}
function addCounter(device, date, count) {
    fine(`adding count: ${count}, for device: ${device.name}`)

    const store = stores[device.name];
    store.push([date.toISOString(), count]);
}


// Initialize listeners for each device
const devices = require("./devices.json");
devices.forEach(device => {

    fine(`connecting to device: ${device.name}`)
    connect(device)

        .then(xapi => {
            debug(`connected to device: ${device.name}`);

            // Check devices can count
            xapi.status
                .get('RoomAnalytics PeopleCount')
                .then((counter) => {
                    fine(`fetched PeopleCount for device: ${device.name}`);

                    // Abort if device does not count
                    var count = counter.Current;
                    if (count == -1) {
                        debug(`device is not counting: ${device.name}`);
                        return;
                    }

                    // Store first TimeSeries
                    createStore(device);
                    addCounter(device, new Date(Date.now()), count);

                    // Listen to events
                    fine(`adding feedback listener to device: ${device.name}`);
                    xapi.feedback.on('/Status/RoomAnalytics/PeopleCount', (counter) => {
                        fine(`new PeopleCount for device: ${device.name}`);

                        if (count == -1) {
                            debug(`WARNING: device has stopped counting: ${device.name}`);
                            return;
                        }

                        // register new TimeSeries
                        var count = counter.Current;
                        addCounter(device, new Date(Date.now()), count);
                    });

                })
                .catch((err) => {
                    console.log(`Failed to fetch PeopleCount, err: ${err.message}`);
                    console.log(`Are you interacting with a RoomKit? exiting...`);
                    xapi.close();
                });
        })
        .catch(err => {
            debug(`could not connect device: ${device.name}`)
        })
});


// 
// Clean TimeSeries 
//

// Collect interval (moving window of collected time series)
var window = process.env.WINDOW ? process.env.WINDOW : 15 * 60; // in seconds 
debug(`collecting window: ${window} second(s)`);

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

const { computeBarycentre } = require("./barycentre");

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
