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
    todo["completed"] = false
    @store[uid] = todo
    todo
  end

  def [](uid)
    @store[uid]
  end

  def all_todos
    @store.values
  end

  def clear!
    @store = {}
  end

  def delete(uid)
    @store.delete(uid)
  end
end

class TodoApp < Sinatra::Base
  def initialize
    super
    @repo = TodoRepo.new
  end

  configure :development do
    require 'sinatra/reloader'
    register Sinatra::Reloader
  end

  before do
    headers "access-control-allow-origin" => "*"
    if env.has_key? "HTTP_ACCESS_CONTROL_REQUEST_HEADERS"
      headers "access-control-allow-headers" => env["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"]
    end
  end

  def json_body
    JSON.parse(request.env["rack.input"].read)
  end

  def todos_url
    uri( "/todos" )
  end

  def todo_url(todo)
    uri( "/todos/#{todo.fetch("uid")}" )
  end

  def todo_repr(todo)
    todo.merge({
      "href" => todo_url(todo),
      "url" => todo_url(todo)
    })
  end

  get '/' do
    redirect todos_url
  end

  options '/todos' do
    headers "access-control-allow-methods" => "GET,HEAD,POST,DELETE,OPTIONS,PUT"
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

  delete "/todos" do
    @repo.clear!
    status 204
  end

  def lookup_todo_or_404
    todo = @repo[params[:todo_uid]]
    halt 404 if todo.nil?
    todo
  end

  options '/todos/:todo_uid' do
    headers "access-control-allow-methods" => "GET,PATCH,HEAD,DELETE,OPTIONS"
  end

  get "/todos/:todo_uid" do
    todo_repr(lookup_todo_or_404).to_json
  end

  delete "/todos/:todo_uid" do
    @repo.delete(params[:todo_uid])
    status 204
  end

  patch "/todos/:todo_uid" do
    todo = lookup_todo_or_404
    todo.merge!( json_body )
    todo_repr(todo).to_json
  end
end
