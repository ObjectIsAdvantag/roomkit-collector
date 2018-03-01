//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

/** 
 * Collects PeopleCount analystics from a collection of RoomKits
 */

const debug = require("debug")("barycentre");
const fine = require("debug")("barycentre:fine");

 
// A series is an ordered collection of ticks and values
// tick are formatted as dates

// Computes the weighted average on the period (begin/end)
// for the time-series values (as a map of time / values)
// The algorithm considers the values are substains till next serie is registered
module.exports.computeBarycentre = function (series, from, to) {
    let computed = 0;
    let previousSerie = undefined;
    let begun = false;
    let skippedMilliseconds = 0; // Store periods where the device was not counting (typically went to standby mode)

    fine(`requested to compute barycentre from: ${from}, to: ${to}, with ${series.length} values in serie`)

    for (var i = 0; i < series.length; i++) {
        var serie = series[i];
        if (serie[0] <= from) {
            // We've not started yet, let's skip to next serie
            previousSerie = serie;
            continue;
        }

        if (!begun) {
            if (!previousSerie) {
               // throw an error if from is before the series begins
               throw new Error("from is before serie begins")
            }

            previousSerie = [ from, previousSerie[1]];
            begun = true;
        }

        if (serie[0] >= to) {
            // we are done, add serie's value till 'to'
            computed += previousSerie[1] * (new Date(to).getTime() - new Date(previousSerie[0]).getTime());
            previousSerie = serie;
            break;
        }

        // if the value to add is negative, we were not counting on this period, simply skip it
        if (previousSerie[1] < 0) {
            skippedMilliseconds = new Date(serie[0]).getTime() - new Date(previousSerie[0]).getTime();
        }
        else {
            // let's add the value for the period
            computed += previousSerie[1] * (new Date(serie[0]).getTime() - new Date(previousSerie[0]).getTime());
        }

        previousSerie = serie;
    }

    // Compute average for standard cases between to and from bounts
    // 2 exceptions though, when from or to are after the last series
    // Exception 1: from is after last serie
    let barycentre;
    if (!begun) {
        barycentre = previousSerie[1];
    }
    // Exception 2: to is after last serie
    else if (to >= previousSerie[0]) {
        // add serie's value till 'to'
        computed += previousSerie[1] * (new Date(to).getTime() - new Date(previousSerie[0]).getTime());
    }
    if (!barycentre) {
        barycentre = computed / (new Date(to).getTime() - new Date(from).getTime() - skippedMilliseconds);
    }

    fine(`computed barycentre: ${barycentre}`)
    return barycentre;
}
