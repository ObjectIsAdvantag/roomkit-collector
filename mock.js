//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//


/**
 * Mock version of a REST API that exposes RoomAnalytics
 */

const debug = require("debug")("api");
const fine = require("debug")("api:fine");

var devices;
try {
    devices = require("./devices.json");
}
catch (err) {
    console.log("Please specify a list of devices.")
    process.exit(-1)
}

//
// Web API
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
            message: "Congrats, your RoomAnalytics Aggregator Mock is up and running",
            since: new Date(started).toISOString()
        });
    })

app.get("/devices", function (req, res) {
    const mapped = devices.map((device) => {
        return {
            id: device.id,
            location: device.location,
            ipAddress: device.ipAddress
        };
    });

    res.json(mapped);
})

app.get("/devices/:device", function (req, res) {
    const id = req.params.device;

    let found = devices.find(function (device) {
        return (device.id === id)
    })
    if (!found) {
        res.status(404).json({
            message: "device not found"
        })
        return
    }

    res.json({
        id: found.id,
        location: found.location,
        ipAddress: found.ipAddress
    })
})

app.get("/devices/:device/last", function (req, res) {
    const id = req.params.device;

    const count = Math.round(Math.random() * 5 + 2);
    fine(`returned mock latest: ${count}, for device: ${id}`)
    res.json({
        id: id,
        peopleCount: count
    });
})

app.get("/devices/:device/average", function (req, res) {
    const id = req.params.device;

    // Get period (in seconds)
    let period = req.query.period;
    if (!period) {
        period = 15; // default to 15s
    }

    // Mock'ed data
    const count = Math.round(Math.random() * 7 - 1);
    fine(`returned mock average: ${count}, for device: ${id}`)
    res.json({
        id: id,
        peopleCount: count,
        period: period,
        unit: "seconds"
    });
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