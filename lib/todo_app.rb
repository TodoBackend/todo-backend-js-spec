require 'sinatra'

class TodoApp < Sinatra::Base
  get '/' do
    "[]"
  end
end
