# API to expose RoomKits collected analytics

## Quick start

Fill in your RoomKits info into [devices.json](devices.json)

To run the api in debug mode, type
```shell
DEBUG=api*,collector* node server.js
```

Invoke the REST Resources

- GET / => healthcheck
- GET /devices/Theater/last => returns the latest PeopleCount value fired by the 'Theater' device
- GET /devices/Theater/average?period=30 => returns an averaged PeopleCount value computed from the PeopleCount events fired by the 'Theater' device, over the last 30 seconds

    ```json
    {
        "device": "Theater",
        "peopleCount": 8.508,
        "period": "30",
        "unit": "seconds"
    }
    ```

