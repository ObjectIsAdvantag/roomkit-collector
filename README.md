# PeopleCount Collector for RoomKits

Collect PeopleCount events as time series from RoomKits, and expose counters via a REST API.

Background: 
- RoomKits fire events every time they notice a change for the PeopleCount counter. As participants in a Meeting Room are moving their faces, it is frequent to see regular changes to the PeopleCount counter being fired. If queried mutiple times, even in close intervalls, the PeopleCount value for a RoomKit should be expected to differ.
- The collector batch and barycentre utility create a stable counter for each device part of a RoomKit deployment. The PeopleCounter events for each device is collected in a in-memory timeseries database, and the REST API lets you compute instantly an averaged value for a custom period of time.

This repo contains 3 components:
1. barycentre utility: computes an average value from a Time Series, by weighting each value based on its duration (before next event happens)
2. collector batch: collects PeopleCount events for a pre-configured list of devices, collects as TimeSeries (also recycles TimeSeries out of the observation window)
3. **REST API**: exposes the latest and average weighted value from PeopleCount events fired by the pre-configured list of devices


## API

To install the API, run the instructions below:

```shell
git clone https://github.com/ObjectIsAdvantag/roomkit-collector
cd roomkit-collector
cd api
npm install
```

From the 'api/' directory, edit the [devices.json file](api/devices.json) with your RoomKit deployment.
Here is an example used for Cisco Live Melbourne 2018:

```json
[
    {
        "name": "Theater",
        "location": "CLANZ DevNetZone Theater",
        "ip" : "100.101.3.60",
        "username" : "integrator",
        "password" : "integrator"
    },
    {
        "name": "Workshop1",
        "location": "CLANZ DevNetZone Workshop1",
        "ip" : "100.101.3.61",
        "username" : "integrator",
        "password" : "integrator"
    },
    {
        "name": "Workshop2",
        "location": "CLANZ DevNetZone Workshop2",
        "ip" : "100.101.3.62",
        "username" : "integrator",
        "password" : "integrator"
    }
]
```

Now, run the API in DEBUG mode, and with an observation window of 900 seconds (timeseries older than 15 min are erased):

    ```shell
    DEBUG=collector*,api*  WINDOW=900   node server.js
    ```

All set! 
You can now query the API (make sure to replace 'Theater' below by one of your devices);

- GET / => healthcheck
- GET /analytics/Theater/last => returns the latest PeopleCount value fired by the 'Theater' device 
- GET /analytics/Theater/average?period=30 => returns an averaged PeopleCount value computed from the PeopleCount events fired by the 'Theater' device, over the last 30 seconds

```json
{
    "device": "Theater",
    "peopleCount": 8.508,
    "period": "30",
    "unit": "seconds"
}
```

_Note that the average weighted value is not rounded._


## History

v0.2: updates for Cisco Live Melbourne

v0.1: created at [BCX18 - Bosch IoT Hackathon Berlin](https://github.com/ObjectIsAdvantag/hackathon-resources/tree/master/bcx18-berlin)
