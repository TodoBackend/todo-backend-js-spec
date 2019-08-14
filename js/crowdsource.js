(function(){
mocha.setup('bdd');
mocha.slow("5s");
mocha.timeout("30s"); //so that tests don't fail with a false positive while waiting for e.g a heroku dyno to spin up
window.expect = chai.expect;


var targetRootUrl = window.location.search.substr(1);
  
if( targetRootUrl ){
  defineSpecsFor(targetRootUrl);
  runAndRecordTests();
}else{
  console.warn('no target specified for tests');
}

function runAndRecordTests(){
  mocha.checkLeaks();
  var runner = mocha.run();
  analytics.track('Test Start');

  runner.on('suite end', function(suite){
    if( suite.root ){
      var suitePayload = serializeSuite(suite);

      analytics.track('Test Suite End', suitePayload);
      //console.log('Test Suite End', suitePayload);
    }
  });
};

function serializeSuite(suite){
  var childSuites = _.map( suite.suites, serializeSuite );
  var tests = _.map( suite.tests, function(test){
    return _.pick(test,'duration','title','state','pending','speed','sync','timedOut','type');
  });

  return {
    suites: childSuites,
    tests: tests,
    root: suite.root,
    pending: suite.pending,
    title: suite.title
  };
}

})();
