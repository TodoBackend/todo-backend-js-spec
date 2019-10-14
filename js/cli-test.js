_ = require("underscore");
Q = require("q");
chai = require("chai")
expect = chai.expect;
chaiAsPromised = require("chai-as-promised");
request = require('request');

chai.use(chaiAsPromised);

var node_util = require("./node-util.js");
var specs = require("./specs.js");

ajax = node_util.ajax

var address = process.env.TARGET_ADDRESS;
if(typeof(address) == "undefined") {
  throw Error ("The environment variable TARGET_ADDRESS is not set. Please set it to the address of the backend to be tested.")
}
specs.defineSpecsFor(address);
