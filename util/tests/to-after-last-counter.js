var data = [
    ["2018-02-21T20:24:05.000Z", 4],
    ["2018-02-21T20:24:11.000Z", 1],
    ["2018-02-21T20:24:12.000Z", 2],
    ["2018-02-21T20:24:13.000Z", 3],
    ["2018-02-21T20:24:16.000Z", 10]
];

const { max } = require("../max");
var res = max(data, "2018-02-21T20:24:14.000Z", "2018-02-21T20:24:20.000Z");
console.log(`computed max: ${res}, expecting: 10`);

const { computeBarycentre } = require("../barycentre");
var res = computeBarycentre(data, "2018-02-21T20:24:14.000Z", "2018-02-21T20:24:20.000Z");
console.log(`computed weighted: ${res}, expecting: 7.66...67`);