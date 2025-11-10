# TodoList Application

A full-stack TodoList application built with Node.js and Express.

## Features

- Create, read, update, and delete todos
- RESTful API endpoints
- Request logging to `traffic.log` file using Winston

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   node server.js
   ```

   The server will start on `http://localhost:3000`

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Logging

All API requests are automatically logged to `traffic.log` file with:
- Request method, URL, path, query parameters, and body
- Response status code and duration
- Timestamps for both request and response

Note: The log file can be deleted periodically to manage disk space.