const defineSpecsFor = require ('./specs'); 

// window.TARGET_API_ROOT = 'https://todo-backend-micro.herokuapp.com/';
if( !window.TARGET_API_ROOT ){
  throw new Error('window.TARGET_API_ROOT not defined')
}

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

defineSpecsFor(window.TARGET_API_ROOT);
