const defineSpecsFor = require ('./specs'); 

//const API_ROOT = process.env['TARGET_API_ROOT'];
//if( !API_ROOT ){
  //throw new Error('please specify a target for the specs to test by setting the `TARGET_API_ROOT` environment variable');
//}

const API_ROOT = 'https://todo-backend-micro.herokuapp.com/';

window.Q = require('q');
window._ = require('underscore');
window.$ = require('jquery');
window.expect = require('chai').expect;

const chai = require("chai");

chai.use(require('chai-as-promised'));
window.expect = chai.expect;

mocha.setup('bdd');
mocha.slow("5s");
mocha.timeout("30s"); //so that tests don't fail with a false positive while waiting for e.g a heroku dyno to spin up

defineSpecsFor(API_ROOT);