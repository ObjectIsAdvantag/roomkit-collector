//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

/** 
 * Collects PeopleCount analystics from a collection of RoomKits
 */

const debug = require("debug")("collector");
const fine = require("debug")("collector:fine");


// Check args
// if (!process.env.JSXAPI_DEVICE_URL || !process.env.JSXAPI_USERNAME) {
//     console.info("Please specify info to connect to your device as JSXAPI_DEVICE_URL, JSXAPI_USERNAME, JSXAPI_PASSWORD env variables");
//     console.info("Bash example: JSXAPI_DEVICE_URL='ssh://10.10.1.52' JSXAPI_USERNAME='integrator' JSXAPI_PASSWORD='integrator' node example.js");
//     process.exit(1);
// }

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
    stores[device.id] = [];
}
function addCounter(device, date, count) {
    fine(`adding count: ${count}, for device: ${device.id}`)

    const store = stores[device.id];
    store.push([date.toISOString(), count]);
}


const devices = require("../devices.json");

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
                        fine(`new PeopleCount for device: ${device.id}`);

                        if (count == -1) {
                            debug(`WARNING: device has stopped counting: ${device.id}`);
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
            debug(`could not connect device: ${device.id}`)
        })
});
