# TimeSeries Collector for RoomKits

Collects PeopleCount time series from RoomKits, and computes averaged counters

This repo contains 3 components:
- collector: collects PeopleCount events for a pre-configured list of devices, collects as TimeSeries (also recycles TimeSeries out of the observation window),
- barycentre: computes an average value from a Time Series, by weighting each value based on its duration (before next event happens)
- API: exposes the latest and barycentre value for the pre-configured list of devices 


## History

v0.1: created at BCX18 - Bosch IoT Hackathon Berlin
