# Node.js EJS User Demo

Simple web app with login/logout, registration, and users CRUD.

- Stack: Node.js, Express, EJS, Bootstrap 5, jQuery, express-session
- Data: file-based JSON at `src/models/db.json`

## Quick Start
1) Install deps
```bash
npm install
```
2) Run
```bash
node src/app.js
```
3) Open
- App: http://localhost:3000
- Pages: `/login`, `/register`, `/logout`

## Assignment: Register Feature
- Focus: implement the registration flow (`/register`).
- Client-side validation in `src/public/js/auth-validation.js`: email-format username, password complexity, and confirm-password match.
- Server-side checks in `src/app.js` (`POST /register`): prevents duplicate usernames, verifies password match, returns friendly messages.
- On success, redirects to the login page with a success notice.
## Data Notes
- On start, app copies root `db.json` → `src/models/db.json` (see `initializeDatabase()` in `src/app.js`).
## API
- `GET /users` — list users
- `GET /users/:username` — get by username
- `POST /users` — create `{ username, name, gender }`
- `PUT /users/:userId` — update
- `DELETE /users/:userId` — delete
