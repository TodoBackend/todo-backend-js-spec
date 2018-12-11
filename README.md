# todo-backend-js-spec

Executable specs in javascript for the Todo-Backend API.

## Run in the browser

Start a static web server, eg.:
`python3 -m http.server`

## Run on the command line

Install packages:
```
npm install -g mocha
cd todo-backend-js-spec
npm install
```

Suppose the implementation you want to test is at http://localhost:5000  
Windows:  
`SET TARGET_ADDRESS=http://localhost:5000 && npm test`

Linux:  
`TARGET_ADDRESS=http://localhost:5000 && npm test`
