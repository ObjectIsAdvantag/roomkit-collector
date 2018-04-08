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

app.get("/devices/:device/last", function (req, res) {
    const device = req.params.device;

    const count = Math.round(Math.random() * 5 + 2);
    fine(`returned mock latest: ${count}, for device: ${device}`)
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

    // Mock'ed data
    const count = Math.round(Math.random() * 5 + 2);
    fine(`returned mock average: ${count}, for device: ${device}`)
    res.json({
        device: device,
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
    console.log("   GET /devices/{device}/last for latest PeopleCount value received");
    console.log("   GET /devices/{device}/average?period=30 for a computed average");
});