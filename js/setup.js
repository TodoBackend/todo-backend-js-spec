mocha.setup('bdd');
mocha.slow("5s");
window.expect = chai.expect;


function loadTargetRootFromInput(){
  var targetRoot = $('#target-root input').val();
  window.location.search = targetRoot;
}

$('#target-root button').on('click',loadTargetRootFromInput);
$('#target-root input').on('keyup',function(){
  if(event.keyCode == 13){
    loadTargetRootFromInput();
  }
});


targetRootUrl = window.location.search.substr(1);

if( targetRootUrl ){

  defineSpecsFor(targetRootUrl);

  $("#target-root").hide();
  mocha.checkLeaks();
  var runner = mocha.run();
}
