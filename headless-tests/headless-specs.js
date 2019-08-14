const defineSpecsFor = require ('./specs'); 

//const API_ROOT = process.env['TARGET_API_ROOT'];
//if( !API_ROOT ){
  //throw new Error('please specify a target for the specs to test by setting the `TARGET_API_ROOT` environment variable');
//}

const API_ROOT = 'https://todo-backend-micro.herokuapp.com/';

window.Q = require('q');
window._ = require('underscore');
window.$ = require('jquery');

defineSpecsFor(API_ROOT);
