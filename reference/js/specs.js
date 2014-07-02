describe( "Reference specs for the Todo-Backend API residing at "+TODO_ROOT_URL, function(){

  function ajaxRoot(params){
    return Q.promise( function(resolve,reject){
      params = _.defaults( params, {
        url: TODO_ROOT_URL,
        type: "json",
        contentType: "json",
        success: function(result){
          var xhr = r.request;
          resolve([result,xhr]);
        },
        error: reject
      });

      var r = reqwest(params);
    });
  }

  function getRoot(){
    return ajaxRoot({method:"get"});
  }
  function postRoot(data){
    return ajaxRoot({method:"post",data:JSON.stringify(data)});
  }

  describe( "the basics", function(){
    it("should be able to access "+TODO_ROOT_URL+" from this test runner (i.e. CORS headers are in place)", function(){
      return expect(getRoot()).to.be.fulfilled;
    });

    it("initially returns an empty list of todos", function(){
      var result = getRoot().spread( function(result,xhr){ return result; } );
      return expect(result).to.eventually.eql([]);
    });
  });

  describe( "storing new todos by posting to the root url", function(){
    it("responds with a 201 status code", function(){
      var status = postRoot({a:1}).spread( function(result,xhr){
        return xhr.status;
      });

      return expect(status).to.eventually.eq(201);
    });
  });

});
