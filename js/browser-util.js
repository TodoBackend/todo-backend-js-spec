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
      + xhr.status + ": " + xhr.statusText + " (" + xhr.responseText.replace(/\n*$/, "") + ")"
      + "\n\n"
    );
  }
}

function ajax(httpMethod, url, options){
  var ajaxOptions = _.defaults( (options||{}), {
    type: httpMethod,
    url: url,
    contentType: "application/json",
    dataType: "text", // so we can explicitly parse JSON and fail with more detail than jQuery usually would give us
    timeout: 30000 // so that we don't fail while waiting on a heroku dyno to spin up
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
