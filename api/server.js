//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//


/**
 * REST API that exposes RoomAnalytics
 */

var debug = require("debug")("api");
var fine = require("debug")("api:fine");


//
// HTTP Service
// 

var express = require("express");
var app = express();

// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Add JSON parsing
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var started = Date.now();
app.route("/")
    // healthcheck
    .get(function (req, res) {
        res.json({
            message: "Congrats, your RoomAnalytics Aggregator is up and running",
            since: new Date(started).toISOString()
        });
    })

const { latest, averageOnPeriod } = require("./collector");

app.get("/devices", function (req, res) {
    try {
        const devices = require("./devices.json");

        const mapped = devices.map((device) => {
            return {
                name: device.name,
                location: device.location,
                ip: device.ip
            };
        });

        res.json(mapped);
    }
    catch (err) {
        res.status(500).json({
            message: `no devices list`
        });
        return;
    }
})

app.get("/devices/:device", function (req, res) {
    try {
        const devices = require("./devices.json");

        let device = devices.find(function(elem) { return (elem.name == "Workbench1") })
        if (!device) {
            res.status(404).json({
                message: "device not found"
            })
            return
        }
        
        res.json({
            name: device.name,
            location: device.location,
            ip: device.ip
        })
    }
    catch (err) {
        res.status(500).json({
            message: `no devices list`
        });
    }
})

app.get("/devices/:device/last", function (req, res) {
    const device = req.params.device;

    // Retreive count data for device
    const count = latest(device);

    if (!count) {
        res.status(404).json({
            message: `not collecting data for device: ${device}`
        });
        return;
    }

    res.json({
        device: device,
        peopleCount: count
    });
})

app.get("/devices/:device/average", function (req, res) {
    const device = req.params.device;

    // Get period (in seconds)
    let period = req.query.period;
    if (!period) {
        period = 15; // default to 15s
    }

    // Retreive count data for device
    try {
        const count = averageOnPeriod(device, period);

        res.json({
            device: device,
            peopleCount: count,
            period: period,
            unit: "seconds"
        });
    }
    catch (err) {
        fine(`could not compute average, err: ${err.message}`);
        res.status(400).json({
            message: `period starts before we started collecting data for the device`
        });
    }
})


// Starts the service
//
var port = process.env.OVERRIDE_PORT || process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Collector API started at http://localhost:" + port + "/");
    console.log("   GET / for healthcheck");
    console.log("   GET /devices for the list of devices");
    console.log("   GET /devices/{device} to get the details for the specified device");
    console.log("   GET /devices/{device}/last for latest PeopleCount value received");
    console.log("   GET /devices/{device}/average?period=30 for a computed average");
});