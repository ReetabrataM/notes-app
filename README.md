# Marginalia — Notes SaaS

A production-quality notes application built on the MERN stack with TypeScript throughout, real-time collaboration, sharing, AI-assisted writing, and more.

Built by **Reetabrata Mandal**.

---

## What's included

### Core (Phase 1)
- **Auth**: register, login, JWT access + refresh tokens (rotated on use), logout, logout-from-all-devices, change password, rate limiting, secure httpOnly cookies
- **Notes**: full CRUD, soft delete + restore + permanent delete, pin, archive, favorite, duplicate, word/character count, reading time
- **Rich text editor**: TipTap — bold/italic/underline/strike/highlight, headings, lists, checklists, blockquotes, code blocks, links
- **Organization**: folders, tags, color coding, priority
- **Search & filtering**: MongoDB text search, filters, pagination
- **Dashboard**: counts, storage estimate, most-used tags, recent notes, activity chart
- **Security**: Helmet, CORS, rate limiting, Mongo sanitization, XSS cleaning, HPP protection, bcrypt hashing

### Collaboration & organization (Phase 2)
- **Real-time collaboration** (Socket.IO): live note updates between open sessions, presence avatars, typing indicator
- **Sharing**: public read/edit links, invite collaborators by email/username with read or edit access, "Shared with me" view
- **Comments & mentions**: threaded comments per note, `@username` mentions trigger notifications
- **Version history**: every edit snapshots the previous version; compare, restore, see author & timestamp
- **Reminders**: one-off or recurring (daily/weekly/monthly), list + calendar view, in-app + email notification when due (email requires SMTP config)
- **Notifications**: in-app notification center (bell dropdown + full page), live-pushed over Socket.IO
- **Attachments**: upload files to a note (images, PDFs, Office docs, zips, audio/video) — stored locally by default, Cloudinary-ready
- **Bulk actions**: multi-select notes to bulk delete, archive, or tag
- **Drag & drop**: drag a note card onto a folder to file it
- **Export / Import**: export any note to Markdown, PDF, or DOCX; import `.md` files as new notes
- **Command palette** (`Ctrl/Cmd+K`) and keyboard shortcuts (`Ctrl+N` new note)
- **Voice-to-text & OCR**: dictate into a note (Web Speech API) or extract text from a photo (Tesseract.js) — both run entirely in the browser, no API key needed
- **Admin dashboard**: user management (suspend/delete), system stats, activity feed
- **PWA**: installable, works offline for the app shell (service worker via Workbox)
- **AI note actions**: summarize, rewrite, fix grammar, suggest title, explain, translate, bullet points, flashcards, quiz, key points, meeting summary, action items

### Deliberately gated behind your own credentials
Three feature areas call out to third-party services and need your own API keys to actually function. The app runs completely fine without them — each degrades gracefully with a clear message instead of crashing:

| Feature | Env vars needed | Behavior if unset |
|---|---|---|
| AI note actions | `OPENAI_API_KEY` | Returns a clear 400 explaining the key is missing |
| Email (verification, password reset, reminder emails) | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Logs a warning and skips sending; the app doesn't block on it |
| Google OAuth login | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | The "Continue with Google" button is hidden on the login page automatically |
| Cloudinary (attachment storage) | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Falls back to local disk storage under `backend/uploads/` |

---

## Project structure

```
notes-saas/
├── backend/
│   └── src/
│       ├── config/        # env, db, multer, passport (Google OAuth)
│       ├── models/        # Mongoose schemas (12 collections)
│       ├── repositories/   # data access layer
│       ├── services/      # business logic (incl. sharing, AI, export/import)
│       ├── controllers/   # thin HTTP handlers
│       ├── routes/        # Express routers
│       ├── middlewares/   # auth, admin guard, validation, error handling
│       ├── socket/        # Socket.IO server (presence, live updates)
│       ├── jobs/          # background reminder-due checker
│       ├── emails/        # Nodemailer templates
│       ├── validators/    # express-validator chains
│       ├── utils/         # jwt, logger, api response, seed script
│       └── tests/         # Jest + Supertest
└── frontend/
    └── src/
        ├── api/           # axios client + endpoint modules per feature
        ├── components/    # ui/, layout/, notes/ (editor, panels, toolbars)
        ├── hooks/         # React Query hooks per feature + socket hook
        ├── lib/           # socket.io client singleton, cn utility
        ├── pages/         # route-level components (23 pages)
        ├── store/         # Zustand (auth, theme)
        ├── styles/        # Tailwind + design tokens
        └── types/         # shared TS types
```

---

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env
```

At minimum, edit `.env` and set:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` / `COOKIE_SECRET` — long random strings (e.g. `openssl rand -hex 32`)

> **Important:** if you ever paste a real database password into a chat, doc, or shared file, treat it as compromised and rotate it in Atlas immediately (Database Access → edit user → new password).

Optionally add `OPENAI_API_KEY`, `SMTP_*`, `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, or `CLOUDINARY_*` to unlock those integrations — see the table above.

```bash
npm install
npm run seed   # optional: creates demo@notesapp.dev / Password123 with sample notes
npm run dev    # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api/v1
npm install
npm run dev             # starts on http://localhost:5173
```

Visit `http://localhost:5173`, register an account (or log in with the seed account above).

### 3. Docker (alternative)

```bash
cp backend/.env.example backend/.env   # fill in real values first
docker compose up --build
```

Frontend: `http://localhost:5173` · Backend: `http://localhost:5000`

### 4. Running tests

```bash
cd backend
npm test
```

Note: the first run downloads a small MongoDB binary for the in-memory test database (`mongodb-memory-server`), so it needs normal internet access once.

---

## API overview

Base URL: `/api/v1`

| Area | Routes |
|---|---|
| Auth | `POST /auth/{register,login,refresh,logout,logout-all,change-password,verify-email,forgot-password,reset-password}`, `GET /auth/google[/callback]` |
| Users | `GET/PATCH /users/me` |
| Notes | `GET/POST /notes`, `GET/PATCH/DELETE /notes/:id`, `POST /notes/:id/{restore,pin,archive,favorite,duplicate}`, `DELETE /notes/:id/permanent`, `POST /notes/bulk/{delete,archive,tag}` |
| Folders / Tags | `GET/POST /folders`, `PATCH/DELETE /folders/:id`, `GET/POST /tags`, `DELETE /tags/:id` |
| Dashboard | `GET /dashboard/stats` |
| Comments | `GET/POST /comments/note/:noteId`, `DELETE /comments/:id` |
| Versions | `GET /versions/note/:noteId`, `POST /versions/note/:noteId/restore/:versionId` |
| Reminders | `GET/POST /reminders`, `POST /reminders/:id/complete`, `DELETE /reminders/:id` |
| Notifications | `GET /notifications`, `POST /notifications/:id/read`, `POST /notifications/read-all` |
| Attachments | `GET/POST /attachments/note/:noteId`, `DELETE /attachments/:id` |
| Sharing | `GET/PATCH /sharing/note/:noteId`, `POST/DELETE /sharing/note/:noteId/collaborators[/:userId]`, `GET /sharing/public/:token`, `GET /sharing/shared-with-me` |
| Admin | `GET /admin/users`, `PATCH /admin/users/:id/suspend`, `DELETE /admin/users/:id`, `GET /admin/{stats,activity}` |
| AI | `POST /ai/run` |
| Export/Import | `GET /export/notes/:id/{markdown,pdf,docx}`, `POST /export/notes/import/markdown` |
| Public config | `GET /config` — tells the frontend which optional integrations are enabled |

All responses follow `{ success, message, data, meta? }`.

---

## Notes on security

- Passwords are hashed with bcrypt (12 rounds) and never returned by the API.
- Access tokens are short-lived (15m); refresh tokens are stored hashed in a `Session` collection, rotated on every refresh, and can be revoked in bulk via "logout all devices."
- Note access for collaborators is access-controlled at the service layer (`owner` / `edit` / `read`), enforced on every read and write, not just the UI.
- The `.env.example` file contains placeholders only — real secrets belong in a local, git-ignored `.env`.
