# TimeSeries Collector for RoomKits

Collects PeopleCount time series from RoomKits, and computes averaged counters

This repo contains 3 components:
- collector: collects PeopleCount events for a pre-configured list of devices, collects as TimeSeries (also recycles TimeSeries out of the observation window)
- barycentre: computes an average value from a Time Series, by weighting each value based on its duration (before next event happens)
- API: exposes the latest and average value for PeopleCount, for a pre-configured list of devices 


## API

To run the API, in DEBUG mode, with a collector that stores PeopleCount value as TimeSeries in a in-memory per-device storage, and with a window of 15 minutes (900 seconds):

```shell
git clone https://github.com/ObjectIsAdvantag/roomkit-collector
cd api
npm install
DEBUG=collector*,api*  WINDOW=900   node server.js
```

Then query the API
- GET / => healthcheck
- GET /analytics/Theater/last => returns the latest PeopleCount value fired by the device 
- GET /analytics/Theater/average?period=30 => returns an averaged PeopleCount value computed from the PeopleCount events fired by the Theater device, over the last 30 seconds (the average value is weigthed)
    ```json
    {
        "device": "Theater",
        "peopleCount": 1.508,
        "period": "10",
        "unit": "seconds"
    }
    ```


## History

v0.1: created at BCX18 - Bosch IoT Hackathon Berlin
