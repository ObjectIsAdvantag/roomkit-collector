//
// Server receive the events
// 

var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var debug = require("debug")("api");
var fine = require("debug")("api:fine");


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

app.get("/analytics/:device/last", function (req, res) {
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

app.get("/analytics/:device/average", function (req, res) {
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
    console.log("   GET /analytics/{device} for data");
});