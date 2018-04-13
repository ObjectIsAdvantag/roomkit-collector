//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

const debug = require("debug")("max");
const fine = require("debug")("max:fine");

 
// A series is an ordered collection of ticks and values
// tick are formatted as dates

// Returns the max value on the period (begin/end)
// for the time-series values (as a map of time / values)
module.exports.max = function (series, from, to) {    
    fine(`requested to compute max from: ${from}, to: ${to}, with ${series.length} values in serie`)

    let max = -1;
    for (var i = 0; i < series.length; i++) {
        var serie = series[i];
        if (serie[0] < from) {
            // We've not started yet, let's skip to next serie
            continue;
        }

        if (serie[0] > to) {
            // we are done, add serie's value till 'to'
            break;
        }

        // if the value to add is negative, we were not counting on this period, simply skip it
        if (serie[1] > max) {
            max = serie[1]
        }
    }

    fine(`found max value: ${max}`)
    return max;
}
