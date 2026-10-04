# TextUtilityTool

A full-stack web application for performing various text utility functions with user authentication and history tracking.

## Features
- **User Authentication**: Secure registration and login using JWT.
- **Text Utilities**: Various tools to manipulate text.
- **History Tracking**: Keeps a history of user actions (saved in MongoDB).
- **Responsive Frontend**: Clean UI built with HTML, CSS, and JavaScript.
- **Playwright Testing**: E2E testing framework integrated.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Testing**: Playwright

## Project Structure
- `/Frontend` - Contains all static frontend assets (HTML, CSS, JS).
- `/BACKEND` - Contains the Express.js server, Mongoose models, and API routes.
- `/tests` - Playwright end-to-end tests.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd BACKEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `BACKEND` folder using `.env.example` as a template:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   *The server will run on port 3000.*

### 2. Frontend Setup
You can serve the `Frontend` directory using any static file server (like Live Server or `http-server`).
1. Install `http-server` globally (if not installed):
   ```bash
   npm install -g http-server
   ```
2. Run from the root directory:
   ```bash
   http-server ./Frontend -p 5500 --cors
   ```
3. Open your browser and navigate to `http://127.0.0.1:5500`.

## Testing
Playwright is installed for end-to-end testing.
To run tests:
```bash
npx playwright test
```
