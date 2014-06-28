require 'sinatra'

class TodoApp < Sinatra::Base
  get '/' do
    "hello world"
  end
end
