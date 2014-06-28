ENV['RACK_ENV'] = 'test'

require 'rspec'
require 'json'
require 'rack/test'

require 'pry'

require_relative '../lib/todo_app'

describe 'acceptance specs' do
  include Rack::Test::Methods

  def app
    TodoApp.new
  end

  def last_response_json
    JSON.parse(last_response.body)
  end

  def todos_url
    "/todos"
  end

  let(:todo_text){ "I'm a todo" }

  def post_a_new_todo
    post todos_url, {"text" => todo_text}.to_json
  end

  it 'returns an empty list of todos' do
    get todos_url
    expect(last_response).to be_ok
    expect(last_response_json).to eq []
  end

  describe 'storing a new todo' do

    def verify_todo_looks_correct( actual_todo )
      expect(actual_todo["text"]).to eq todo_text
      expect(actual_todo).to have_key("href")
    end

    it 'returns a 201 which contains the new todo' do
      post_a_new_todo
      expect(last_response.status).to eq 201
      verify_todo_looks_correct(last_response_json)
    end

    it 'returns a location pointing to the new todo' do
      post_a_new_todo
      expect(last_response.location).to be

      get last_response.location
      expect(last_response).to be_ok
      verify_todo_looks_correct(last_response_json)
    end

    it "creates a todo which contains an href to itself" do
      post_a_new_todo
      new_todo_url = last_response.location
      get new_todo_url
      expect(last_response_json["href"]).to eq(new_todo_url)
    end

    it 'lists new todos' do
      post_a_new_todo

      get todos_url

      all_todos = last_response_json
      expect(all_todos.count).to be(1)
      verify_todo_looks_correct(all_todos[0])
    end
  end

  it 'supports deleting all todos' do
    post_a_new_todo
    post_a_new_todo

    get todos_url

    expect(last_response_json).not_to be_empty

    existing_todo_url = last_response_json.first["href"]
    get existing_todo_url
    expect(last_response.status).to eq 200

    delete todos_url
    expect(last_response.status).to eq 204 # no content

    get todos_url

    expect(last_response_json).to be_empty

    get existing_todo_url
    expect(last_response.status).to eq 404
  end


  # TODO: content type
end
