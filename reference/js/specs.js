describe( "Reference specs for the Todo-Backend API residing at "+TODO_ROOT_URL, function(){

  function ajax(params){
    var params = _.defaults( params, {
      url: TODO_ROOT_URL,
      dataType: "json",
      contentType: "json",
    });
    return Q($.ajax(params));
  }

  function getRoot(){
    return ajax({type:"get"});
  }
  function postRoot(data){
    return ajax({type:"post",data:JSON.stringify(data)});
  }
  function deleteRoot(){
    return ajax({type:"delete"});
  }
  function get(url){
    return ajax({type:"get",url:url});
  }
  function patch(url,data){
    return ajax({type:"patch",url:url,data:JSON.stringify(data)});
  }

  describe( "first things first: can we access the server?", function(){
    it("access "+TODO_ROOT_URL+" from this test runner (i.e. CORS headers are in place)", function(){
      return expect(getRoot()).to.be.fulfilled;
    });
  });


  describe( "the basics", function(){
    beforeEach(function(){
      return deleteRoot();
    });

    it("initially returns an empty list of todos", function(){
      return expect(getRoot()).to.become([]);
    });
  });

  describe( "storing new todos by posting to the root url", function(){
    beforeEach(function(){
      return deleteRoot();
    });

    it("adds a new todo to the list of todos at the root url", function(){
      var getAfterPost = postRoot({title:"walk the dog"}).then(getRoot);
      return getAfterPost.then(function(todosFromGet){
        expect(todosFromGet).to.have.length(1);
        expect(todosFromGet[0]).to.have.property("title","walk the dog");
      });
    });

    it("returns a representation of the newly-created todo", function(){
      var postResult = postRoot({title:"walk the dog"});
      return expect(postResult).to.eventually.have.property("title","walk the dog");
    });

    function createTodoAndVerifyItLooksValidWith( verifyTodoExpectation ){
      return postRoot({title:"blah"})
        .then(verifyTodoExpectation)
        .then(getRoot)
        .then(function(todosFromGet){
          verifyTodoExpectation(todosFromGet[0]);
      });
    }

    it("sets up a new todo as initially not completed", function(){
      return createTodoAndVerifyItLooksValidWith(function(todo){
        expect(todo).to.have.property("completed",false);
        return todo;
      });
    });

    it("each new todo has a url", function(){
      return createTodoAndVerifyItLooksValidWith(function(todo){
        expect(todo).to.have.property("url").is.a("string");
        return todo;
      });
    });
  });

  describe( "modifying an existing todo", function(){
    beforeEach(function(){
      return deleteRoot();
    });

    function createFreshTodoAndGetItsUrl(){
      return postRoot({title:"wash the dog"})
        .then( function(newTodo){ return newTodo.url; } );
    };

    it("can change the todo's title by PATCHing to the todo's url", function(){
      return createFreshTodoAndGetItsUrl()
        .then( function(urlForNewTodo){
          return patch( urlForNewTodo, {title:"bathe the cat"} );
        }).then( function(patchedTodo){
          expect(patchedTodo).to.have.property("title","bathe the cat");
        });
    });

    it("can change the todo's completedness by PATCHing to the todo's url", function(){
      return createFreshTodoAndGetItsUrl()
        .then( function(urlForNewTodo){
          return patch( urlForNewTodo, {completed:true} );
        }).then( function(patchedTodo){
          expect(patchedTodo).to.have.property("completed",true);
        });
    });

    it("changes to a TODO are persisted and show up when re-fetching the todo", function(){
      var patchedTodo = createFreshTodoAndGetItsUrl()
        .then( function(urlForNewTodo){
          return patch( urlForNewTodo, {title:"changed title", completed:true} );
        });

      var verifyRefetchedTodo = patchedTodo.then(function(todo){
        return get( todo.url );
      }).then( function(refetchedTodo){
        expect(refetchedTodo).to.have.property("completed",true);
        expect(refetchedTodo).to.have.property("title","changed title");
      });

      function verifyTodosProperties(todo){
        expect(todo).to.have.property("completed",true);
        expect(todo).to.have.property("title","changed title");
      }

      var verifyRefetchedTodo = patchedTodo.then(function(todo){
        return get( todo.url );
      }).then( function(refetchedTodo){
        verifyTodosProperties(refetchedTodo);
      });

      var verifyRefetchedTodoList = patchedTodo.then(function(){
        return getRoot();
      }).then( function(todoList){
        expect(todoList).to.have.length(1);
        verifyTodosProperties(todoList[0]);
      });

      return Q.all([
        verifyRefetchedTodo,
        verifyRefetchedTodoList
      ]);
    });
  });

});
