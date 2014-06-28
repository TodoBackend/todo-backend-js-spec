require 'sinatra'
require 'json'
require 'securerandom'

class TodoRepo
  def initialize
    @store = {}
  end

  def add_todo(todo)
    todo = todo.clone
    uid = SecureRandom.uuid
    todo["uid"] = uid
    @store[uid] = todo
    todo
  end

  def [](uid)
    @store[uid]
  end

  def all_todos
    @store.values
  end
end

class TodoApp < Sinatra::Base
  def initialize
    super
    @repo = TodoRepo.new
  end

  def json_body
    JSON.parse(request.env["rack.input"].read)
  end

  def todos_url
    "/todos"
  end

  def todo_url(todo)
    "/todos/#{todo.fetch("uid")}"
  end

  def todo_repr(todo)
    todo.merge({
      "href" => todo_url(todo)
    })
  end

  get '/' do
    redirect todos_url
  end

  get '/todos' do
    @repo.all_todos.map{|t|todo_repr(t)}.to_json
    # content_type :json
  end
  
  post "/todos" do
    new_todo = json_body
    stored_todo = @repo.add_todo(new_todo)


    headers["Location"] = todo_url(stored_todo)
    status 201
    # content_type :json
    todo_repr(stored_todo).to_json
  end

  get "/todos/:todo_uid" do
    todo = @repo[params[:todo_uid]]
    
    halt 404 if todo.nil?

    todo_repr(todo).to_json
  end
end
