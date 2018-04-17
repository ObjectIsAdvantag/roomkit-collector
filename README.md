# PeopleCount Collector for Room Devices

Collects PeopleCount events from SX, MX, Room Devices as time series, and exposes derivated counters via a REST API.

Background: 
- Room Devices fire events every time they notice a change. As participants in meeting roms happen to move their head, it is frequent to see updates to the PeopleCount counter even though no participant entered or left the room. Thus, when queried several times, even in close intervals, the PeopleCount value returned by a Room Kit would be expected to differ.
- The collector batch utility and 'barycentre' computation help create a stable counter for each device part of a RoomKit deployment. Concretely, PeopleCounter events for each device are collected and stored in an in-memory timeseries database. Moreover, a REST API lets you retreive computed averaged values for a custom period of time.

This repo contains 3 components:
1. [a 'barycentre' utility](util/barycentre.js): computes an average value from a Time Series, by weighting each value based on its duration (before next event happens)
2. [a collector batch](collector/collector.js): collects PeopleCount events for a pre-configured list of devices, and stores them as TimeSeries (also recycles all elapsed TimeSeries, aka, out of the observation window)
3. [a REST API](server.js): exposes the latest and average weighted value from PeopleCount events fired by a [pre-configured list of devices](devices.json). Note that a [Mock](mock.js) exposes random values for the same list of devices.


## API

To install the API, run the instructions below:

```shell
git clone https://github.com/ObjectIsAdvantag/roomkit-collector
cd roomkit-collector
npm install
```

Let's now configure the API for your Room Devices deployment.
From the 'api/' directory, edit the [devices.json file](api/devices.json) with your RoomKit deployment.
Here is an example used for DevNet Create 2018:

```json
[
  {
    "id": "Workbench1",
    "location": "Workshop 1",
    "ipAddress": "192.68.1.32"
  },
  {
    "id": "Workbench2",
    "location": "Workshop 2",
    "ipAddress": "192.68.1.33"
  },
  {
    "id": "Workbench3",
    "location": "Workshop 3",
    "ipAddress": "192.68.1.34"
  }
]
```

Now, we wimm run the API in DEBUG mode, and with an observation window of 60 seconds (time series older than 1 minute are erased):

```shell
DEBUG=collector*,api*  WINDOW=60   node server.js
```

All set! 
You can now query the API (make sure to replace 'Theater' below by one of your devices);

- GET / => healthcheck
- GET /devices => returns the list of devices for which data is  collected
- GET /devices/Workbench1 => returns the details for the specified device
- GET /devices/Workbench1/last => returns the latest PeopleCount value fired by the 'Workbench1' device
- GET /devices/Workbench1/max => returns the max value on the default period (15 seconds)  
- GET /devices/Workbench1/average?period=60 => returns an averaged PeopleCount value computed from the PeopleCount events fired by the 'Workbench1' device, over the last 60 seconds

```json
{
    "device": "Workbench1",
    "peopleCount": 8.508,
    "period": "60",
    "unit": "seconds"
}
```

_Note that the average weighted value is not rounded by default._


## History

v0.4: updates for [DevNet Create](https://devnetcreate.io/) with a [React Map](https://github.com/ObjectIsAdvantag/roomkit-react-map) companion

v0.3: updates for [Cisco Connect Finland](https://www.cisco.com/c/m/fi_fi/training-events/2018/cisco-connect/index.html#~stickynav=2) (Messukeskus)

v0.2: updates for [Cisco Live Melbourne](https://www.ciscolive.com/anz/)

v0.1: created at [BCX18 - Bosch IoT Hackathon Berlin](https://github.com/ObjectIsAdvantag/hackathon-resources/tree/master/bcx18-berlin)
