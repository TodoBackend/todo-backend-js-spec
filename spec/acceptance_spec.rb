ENV['RACK_ENV'] = 'test'

require 'rspec'
require 'json'
require 'rack/test'

require 'pry'

require_relative '../lib/todo_app'

describe 'acceptance specs' do
  include Rack::Test::Methods

  def app
    TodoApp
  end

  def last_response_json
    JSON.parse(last_response.body)
  end

  it 'returns an empty list of todos' do
    get '/'
    expect(last_response).to be_ok
    expect(last_response_json).to eq []
  end

  it 'returns a 404 for an invalid todo' do
    get '/todos/aasdfasdf'
    expect(last_response.status).to eq 404
  end

  describe 'storing a new todo' do
    def post_a_new_todo
      post '/', %Q|{"text":"my first todo"}|
    end

    def verify_todo_looks_correct( actual_todo )
      expect(actual_todo["text"]).to eq "my first todo"
    end

    it 'returns a 201 which contains the new todo' do
      post_a_new_todo
      expect(last_response.status).to eq 201
      verify_todo_looks_correct(last_response_json)
    end

    it 'returns a 201 with a location pointing to the new todo' do
      post_a_new_todo
      expect(last_response.location).to be

      get last_response.location
      expect(last_response).to be_ok
      verify_todo_looks_correct(last_response_json)
    end

  end

  # TODO: content type
end
