function interpretXhrFail(httpMethod,url, error, response, body){
  var failureHeader = "\n\n"+httpMethod+" "+url+"\nFAILED\n\n";
  if( error ){
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
      + response.statusCode + ": " + response.statusMessage + " (" + body.replace(/\n*$/, "") + ")"
      + "\n\n"
    );
  }
}

function ajax(httpMethod, url, options){

  options = options || {};

  // Translate properties for request js
  if(_.has(options, 'data')) {
    options.body = options.data
    delete options.data
  }

  var ajaxOptions = _.defaults( options, {
    method: httpMethod,
    url: url,
    headers: {'Content-Type': 'application/json'},
    timeout: 30000 // so that we don't fail while waiting on a heroku dyno to spin up
  });

  return Q.promise( function(resolve, reject){

    request(ajaxOptions, function (error, response, body){

      if(error || response.statusCode < 200 || response.statusCode >= 400) {
        reject(interpretXhrFail(httpMethod, url, error, response, body));
      } else {
        resolve(body);
      }
    });
  });
};

module.exports = {
  ajax: ajax
}
