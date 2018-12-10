_ = require("underscore");
Q = require("q");
chai = require("chai")
expect = chai.expect;
chaiAsPromised = require("chai-as-promised");
request = require('request');

chai.use(chaiAsPromised);

var specs = require("./specs.js");

var address = process.env.TARGET_ADDRESS;
specs.defineSpecsFor(address);
