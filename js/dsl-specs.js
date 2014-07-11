function defineSpecsFor(apiRoot){

  function transformResponseToJson(data){
    try{
      return JSON.parse(data);
    } catch(e) {
      var wrapped = new Error("Could not parse response as JSON.");
      wrapped.stack = e.stack;
      throw wrapped;
    }
  }

  function interpretXhrFail(httpMethod,url,xhr){
    var failureHeader = "\n\n"+httpMethod+" "+url+"\nFAILED\n\n";
    if( xhr.status == 0 ){
      return Error(
        failureHeader
        + "The browser failed entirely when make an AJAX request.\n"
        + "Either there is a network issue in reaching the url, or the\n"
        + "server isn't doing the CORS things it needs to do.\n"
        + "Ensure that you're sending back: \n"
        + "  - an `access-control-allow-origin: *` header for all requests\n"
        + "  - an `access-control-allow-headers` header which lists headers such as \"Content-Type\"\n"
        + "\n"
        + "Also ensure you are able to respond to OPTION requests appropriately. \n"
        + "\n"
      );
    }else{
      return Error(
        failureHeader
        + xhr 
        + "\n\n"
      );
    }
  }
  function getJson(url, options){
    return get(url,options).then( transformResponseToJson );
  }

  function get(url, options){
    return ajax("GET", url, options);
  }
  function post(url, data, options){
    options = options || {};
    options.data = JSON.stringify(data);
    return ajax("POST", url, options);
  }
  function postJson(url, data, options){
    return post(url,data,options).then( transformResponseToJson );
  }

  function delete_(url, options){
    return ajax("DELETE", url, options);
  }

  function ajax(httpMethod, url, options){
    var ajaxOptions = _.defaults( (options||{}), {
      type: httpMethod,
      url: url,
      contentType: "json",
      timeout: 5000
    });

    var xhr = $.ajax( ajaxOptions );

    return Q.promise( function(resolve, reject){
      xhr.success( function(){
        return resolve(xhr);
      });
      xhr.fail( function(){
        reject(interpretXhrFail(httpMethod,url,xhr));
      });
    });
  };

  describe( "Todo-Backend API residing at "+apiRoot, function(){
    describe( "the pre-requisites", function(){
      specify( "the api root responds to a GET (i.e. the server is up and accessible, CORS headers are set up)", function(){
        var getRoot = get(apiRoot);

        return expect( getRoot ).to.be.fulfilled;
      });

      specify( "the api root responds to a POST with the todo which was posted to it", function(){
        var postRoot = postJson(apiRoot, {title:"a todo"});
        return Q.all([
          expect( postRoot ).to.be.fulfilled,
          expect( postRoot ).to.eventually.have.property("title","a todo")
        ]);
      });

      specify( "the api root responds successfully to a DELETE", function(){
        var deleteRoot = delete_(apiRoot);
        return expect( deleteRoot ).to.be.fulfilled;
      });

      specify( "after a DELETE the api root responds to a GET with a JSON representation of an empty array", function(){
        var deleteThenGet = delete_(apiRoot).then(function(){ return getJson(apiRoot); });

        return expect( deleteThenGet ).to.become([]);
      });

    });
  });
}
