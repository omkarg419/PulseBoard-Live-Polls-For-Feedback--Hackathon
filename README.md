# PulseBoard

PulseBoard is a live polling and feedback platform with a React/Vite frontend, an Express/MongoDB backend, Firebase Authentication, and Socket.IO-powered realtime updates. It lets creators build polls, publish expired polls for public viewing, collect authenticated responses, and monitor analytics as results change.

## What It Does

- Create polls with one or more questions and at least two options per question.
- Protect creator actions with Firebase Authentication.
- Track response totals, vote splits, and participation insights.
- Push response and analytics updates over Socket.IO in realtime.
- Display a public poll page for viewing poll details and results.

## Tech Stack

- Frontend: React 19, Vite, React Router, Tailwind CSS, Axios, Firebase client SDK, Socket.IO client
- Backend: Node.js, Express 5, MongoDB with Mongoose, Firebase Admin SDK, Socket.IO
- Dev tooling: ESLint, Nodemon

## Project Structure

- `client/` contains the React application.
- `server/` contains the API, MongoDB models, auth middleware, and Socket.IO server.
- `server/docker-compose.yml` is provided for running MongoDB locally in Docker.
- `server/firebase/` contains the Firebase Admin service account JSON used by the backend.

## Main Features

### Client

- Home landing page with product highlights and entry points.
- Google sign-in through Firebase Auth.
- Creator dashboard with poll statistics and publish actions.
- Poll creation flow with dynamic questions and options.
- Analytics view with summary cards and response charts.
- Public poll page for viewing poll details, response status, and final results.

### Server

- `GET /health` health check.
- Auth endpoints for syncing and reading the current Firebase user.
- Poll CRUD endpoints plus publish and public poll fetch support.
- Response submission and response listing endpoints.
- Analytics endpoint for creator-facing summaries.
- Socket rooms per poll for live response and analytics broadcasts.

## Requirements

- Node.js 18 or newer
- npm
- MongoDB 8+ locally or a MongoDB-compatible URI
- A Firebase project for client auth and Firebase Admin verification

## Environment Variables

### Client `client/.env`

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_SOCKET_SERVER_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:3000/api
```

### Server `server/.env`

```env
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/pulseboard
MONGO_DB_NAME=pulseboard
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password
MONGO_INITDB_DATABASE=pulseboard
```

If you use Docker for MongoDB, keep the root username/password values aligned with `server/docker-compose.yml`.

### Firebase Admin Credentials

The backend imports a service account file from `server/firebase/firebase-adminsdk.json`. Make sure that file exists and contains valid Firebase Admin credentials for your project.

## Local Setup

### 1. Install dependencies

From the repository root:

```bash
cd client
npm install
cd ../server
npm install
```

### 2. Start MongoDB

If you want to use the provided Docker setup:

```bash
cd server
docker compose up -d
```

If you are using a local MongoDB instance, point `MONGO_URI` at it instead.

### 3. Run the backend

```bash
cd server
npm run dev
```

The API runs on `http://localhost:3000` by default.

### 4. Run the frontend

In a second terminal:

```bash
cd client
npm run dev
```

The app runs on Vite’s default dev server, usually `http://localhost:5173`.

## Available Scripts

### Client

- `npm run dev` starts the Vite dev server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` previews the production build.

### Server

- `npm run dev` starts the API with Nodemon.
- `npm start` starts the API with Node.

## API Overview

### Auth

- `POST /api/auth/sync-user`
- `GET /api/auth/me`

### Polls

- `GET /api/polls/public/:pollId`
- `POST /api/polls`
- `GET /api/polls`
- `GET /api/polls/:pollId`


### Responses

- `POST /api/responses/:pollId`
- `GET /api/responses/:pollId`

### Analytics

- `GET /api/analytics/:pollId`

## Realtime Events

The client and server use the following Socket.IO events:

- `join-poll`
- `leave-poll`
- `response-update`
- `analytics-update`
- `poll-published`

## Important Notes

- The client automatically attaches the Firebase ID token to API requests when a user is signed in.
- Creator endpoints and analytics are protected by Firebase Bearer token auth.
- The public poll route can load poll data, but response submission and analytics access still depend on the backend auth rules.
- Expired polls are managed on the server and can be published publicly once they are marked expired.

## Troubleshooting

- If the API fails to start, check that MongoDB is reachable and `MONGO_URI` is correct.
- If Firebase login works but API requests fail, verify the Firebase Admin service account file and the client/server Firebase configuration.
- If the frontend cannot reach the backend, confirm `VITE_API_BASE_URL`, `VITE_SOCKET_SERVER_URL`, and `CLIENT_ORIGIN` are aligned with your local ports.


