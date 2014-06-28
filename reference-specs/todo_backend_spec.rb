require 'rspec'
require 'rest_client'
require 'json'

begin require 'pry' rescue LoadError ; end


TARGET_ROOT_URL = ENV.fetch('TARGET_ROOT_URL') {
  puts "FATAL ERROR:"
  puts "you must provide a TARGET_ROOT_URL environment variable"
  puts "e.g. export TARGET_ROOT_URL='http://localhost:9292/todos'"
  exit 1
}

def give_feedback_that_we_cant_reset_todo_list
  unless $already_given_feedback_about_delete
    puts
    puts "~"*40
    puts "ALERT:"
    puts "unable to delete all todos by sending a DELETE to #{todos_url}"
    puts "you may see spurious test failures as a result."
    puts "~"*40
    puts
    $already_given_feedback_about_delete = true
  end
end


describe 'reference specs for Todo Backend' do
  def todos_url 
    ENV['TARGET_ROOT_URL']
  end

  def get(*args)
    RestClient.get( *args )
  end
  def post(*args)
    RestClient.post( *args )
  end
  def delete(*args)
    RestClient.delete( *args )
  rescue RestClient::Exception
    give_feedback_that_we_cant_reset_todo_list
  end

  before :each do
    delete( todos_url )
  end

  it 'has CORS headers' do
    response = get(todos_url)
    expect(response.raw_headers).to have_key("access-control-allow-origin")
    expect(response.raw_headers["access-control-allow-origin"].first).to eq("*")
  end

  it 'initially returns an empty list' do
    response = get(todos_url)
    expect(response.code).to eq 200
    expect(response.body).to eq "[]"
  end

  describe 'storing a new todo' do

    def verify_response_represents_todo_with_expected_text( response, expected_text )
      parsed_todo_response = JSON.parse(response.body)
      expect(parsed_todo_response).to have_key("text")
      expect(parsed_todo_response["text"]).to eq(expected_text)
    end

    it 'returns a 201 which contains the new todo' do
      response = post( 
        todos_url, 
        {"text" => "my new todo"}.to_json
      )

      expect(response.code).to eq 201
      verify_response_represents_todo_with_expected_text(response,"my new todo")
    end

    it 'returns a 201 with a Location which points to the new todo' do
      post_response = post( 
        todos_url, 
        {"text" => "my new todo"}.to_json
      )

      expect(post_response.code).to eq 201
      expect(post_response.raw_headers).to have_key("location")

      todo_url = post_response.raw_headers["location"].first

      todo_response = get( todo_url )
      expect(todo_response.code).to eq 200
      verify_response_represents_todo_with_expected_text(todo_response,"my new todo")
    end
  end

  it 'lists all stored todos' do
      post( 
        todos_url, 
        {"text" => "feed the pidgeons"}.to_json
      )
      post( 
        todos_url, 
        {"text" => "walk the dog"}.to_json
      )

      todos_response = get( todos_url )
      expect( todos_response.code ).to eq 200
      parsed_todos = JSON.parse(todos_response.body)
      expect( parsed_todos.count ).to be(2)
      expect( parsed_todos[0]["text"] ).to eq "feed the pidgeons"
      expect( parsed_todos[1]["text"] ).to eq "walk the dog"
  end

  it 'deletes all todos' do
      post( 
        todos_url, 
        {"text" => "walk the dog"}.to_json
      )

      delete( todos_url )

      todos_response = get( todos_url )
      expect( todos_response.code ).to eq 200
      expect( JSON.parse(todos_response.body) ).to eq []
  end
end
