//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

const collector = require("../collector");

// Wait 30s to make sure we had time to record a few values, 
// then schedule a computation every 15 seconds
console.log(`waiting 30 seconds`);
setTimeout(function () {

    var device = "Theater";
    setInterval(function () {

        console.log(`computing barycentre for device: ${device}`);
    
        const result = collector.averageOnPeriod(device, 15)
        console.log(`computed barycentre: ${result}, for device: ${device}`);
    
    }, 15 * 1000); // in milliseconds

}, 30 * 1000); // in milliseconds


