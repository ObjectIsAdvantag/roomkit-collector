# TimeSeries Collector for RoomKits

Collects PeopleCount time series from RoomKits, and computes averaged counters

This repo contains 3 components:
- collector: collects PeopleCount events for a pre-configured list of devices, collects as TimeSeries (also recycles TimeSeries out of the observation window)
- barycentre: computes an average value from a Time Series, by weighting each value based on its duration (before next event happens)
- API: exposes the latest and average weigthed number from PeopleCount events fired by the pre-configured list of devices


## API

To install the API, run the instructions below:

    ```shell
    git clone https://github.com/ObjectIsAdvantag/roomkit-collector
    cd api
    npm install
    ```

From the 'api/' directory, edit the devices.json file with your RoomKit deployment.
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
    git clone https://github.com/ObjectIsAdvantag/roomkit-collector
    cd api
    npm install
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

    Note that the average weighted value is not rounded.


## History

v0.1: created at BCX18 - Bosch IoT Hackathon Berlin
