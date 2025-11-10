# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack TodoList application built with Node.js and Express, featuring a RESTful API backend and vanilla JavaScript frontend. The application uses an in-memory data store and logs all API traffic using Winston.

## Development Commands

### Start the Server
```bash
node server.js
```
Server runs on `http://localhost:3000`

### Install Dependencies
```bash
npm install
```

## Architecture

### Backend Structure (server.js)
- **Framework**: Express 5.x
- **Logging**: Winston logger configured to write to `traffic.log` (max 5MB, 5 file rotation)
- **Data Storage**: In-memory array with auto-incrementing IDs starting at 3
- **Middleware Chain**:
  1. `express.json()` - JSON body parser
  2. Custom logging middleware (API routes only) - logs request/response with timing
  3. `express.static()` - serves files from `/public` directory

### Frontend Structure (public/index.html)
- Single-page application with inline CSS and JavaScript
- Vanilla JavaScript (no frameworks)
- Uses Fetch API for all HTTP requests
- Auto-fetches todos on `DOMContentLoaded`

### API Endpoints
- `GET /api/todos` - Returns all todos array
- `POST /api/todos` - Creates new todo (requires `text` in body)
- `PUT /api/todos/:id` - Updates todo (supports `text` and/or `completed` fields)
- `DELETE /api/todos/:id` - Removes todo (returns 204 No Content)

### Data Model
```javascript
{
  id: number,        // Auto-incremented, starts at 3
  text: string,      // Todo description
  completed: boolean // Completion status
}
```

### Logging Behavior
- Only `/api/*` routes are logged
- Each request logs: method, url, path, query, body, timestamp
- Each response logs: method, url, statusCode, duration, timestamp
- Console output confirms logging: `[日志] ${method} ${url} - 已记录到 traffic.log`
- Uncaught exceptions and unhandled rejections are also logged to `traffic.log`

## Important Notes

- **No persistence**: All data is stored in memory and resets on server restart
- **Initial data**: Server starts with 2 pre-populated todos (IDs 1 and 2)
- **No tests**: The test script in package.json is a placeholder
- **Language**: UI text and some comments are in Chinese (中文)
- **Log maintenance**: README mentions deleting `traffic.log` content periodically
