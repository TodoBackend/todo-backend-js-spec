ENV['RACK_ENV'] = 'test'

require 'rspec'
require 'json'
require 'rack/test'

require_relative '../lib/todo_app'

describe 'acceptance specs' do
  include Rack::Test::Methods

  def app
    TodoApp
  end

  it 'returns an empty list of todos' do
    get '/'
    expect(last_response.status).to eq 200
    expect(JSON.parse(last_response.body)).to eq []
  end
end
