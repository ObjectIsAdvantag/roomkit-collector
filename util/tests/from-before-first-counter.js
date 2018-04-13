var data = [
    ["2018-02-21T20:24:05.000Z", 4],
    ["2018-02-21T20:24:11.000Z", 1],
    ["2018-02-21T20:24:12.000Z", 2],
    ["2018-02-21T20:24:13.000Z", 3],
    ["2018-02-21T20:24:16.000Z", 10]
];

const { max } = require("../max");
try {
    const res = max(data, "2018-02-21T20:24:04.000Z", "2018-02-21T20:24:20.000Z");
    console.log(`computed max: ${res}, BUT WAS EXPECTING error`);
}
catch (err) {
    console.log(`raised err: ${err.message}, as expected`);
}


const { computeBarycentre } = require("../barycentre");
try {
    const res = computeBarycentre(data, "2018-02-21T20:24:04.000Z", "2018-02-21T20:24:20.000Z");
    console.log(`computed weighted: ${res}, BUT WAS EXPECTING error`);
}
catch (err) {
    console.log(`raised err: ${err.message}, as expected`);
}