var specs = require("./specs.js");

var address = process.env.TARGET_ADDRESS;
specs.defineSpecsFor(address);
