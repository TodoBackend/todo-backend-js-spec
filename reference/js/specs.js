describe( "Reference specs for the Todo-Backend API residing at "+TODO_ROOT_URL, function(){

  function getRoot(){
    return Q($.ajax({type:"GET",url: TODO_ROOT_URL,dataType:"json"}));
  }

  it("should be able to access "+TODO_ROOT_URL+" from this test runner (i.e. CORS headers are in place)", function(){
    return expect(getRoot()).to.be.fulfilled;
  });

  it("initially returns an empty list of todos", function(){
    return expect(getRoot()).to.eventually.eql([]);
  });
});
