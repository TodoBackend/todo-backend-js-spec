function defineSpecsFor(apiRoot){

  function interpretXhrFail(xhr){
    var failure;
    if( xhr.status == 0 ){
      failure = {
        url: url,
        httpMethod: httpMethod
      }

      return Error(
        "\n\nThe browser failed entirely when make an AJAX request.\n"
        + "Either there is a network issue in reaching the url, or the\n"
        + "server isn't doing the CORS things it needs to do.\n"
        + "Ensure that you're sending back: \n"
        + "  - an `access-control-allow-origin: *` header for all requests\n"
        + "  - an `access-control-allow-headers` header which lists headers such as \"Content-Type\"\n"
        + "\n"
        + "Also ensure you are able to respond to OPTION requests appropriately. \n"
        + "\n"
      );
    }else if( xhr.readyState == 4 ){
      return Error(
        "\n\nAJAX request completed from a network perspective, but failed as far as JQuery is concerned.\n"
        + "Perhaps the response is not valid JSON? \n"
        + "\n"
      );
    }
  }

  function get(url, params){
    var httpMethod = "get";
    var ajaxParams = _.defaults( (params||{}), {
      type: httpMethod,
      url: url,
      dataType: "json",
      timeout: 5000
    });

    var xhr = $.ajax( ajaxParams );

    return Q.promise( function(resolve, reject){
      xhr.success( function(){
        return resolve(xhr);
      });
      xhr.fail( function(){
        reject(interpretXhrFail(xhr));
      });
    });
  };

  describe( "Todo-Backend API residing at "+apiRoot, function(){
    describe( "the pre-requisites", function(){
      it( "responds to a GET (server is up, CORS is working)", function(){
        var getRoot = get(apiRoot);

        return Q.all([
          expect( getRoot ).to.become([])
        ]);
      });
    });
  });
}
