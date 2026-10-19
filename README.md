# GymIA

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=flat)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AI-assisted workout planning and gym client management for fitness professionals.**

GymIA is a full-stack web application exploring how large language models (LLMs) can assist physical education professionals and personal trainers in creating, customizing, and managing personalized training plans. It combines client activity tracking, AI chat coaching sessions, structured workout plan generation via OpenAI, and interactive PDF/print export capabilities.

> **Disclaimer:** GymIA is designed as an assistant tool for qualified physical education professionals to review and validate, not as an autonomous prescription or medical advice service.

---

## Features

- **Personal Trainer & Client Management:** Secure JWT authentication for instructors, client profile tracking, anamnesis, and check-in history.
- **Smart Inactivity Analytics:** Dashboard tracking client activity trends, peak gym hours, and retention, categorizing inactive vs. critically inactive members.
- **AI Workout Plan Generation:** Tailors training plans based on client experience, goals, weekly frequency, and physical limitations using OpenAI fine-tuned models.
- **Interactive Workout Plan Editor:** Professionals can adjust exercises, sets, reps, intervals, and load dynamically before finalizing.
- **AI Coach Chat Sessions:** Integrated chat session management for instructors to converse with an AI fitness assistant directly inside the workspace.
- **Export & Print Ready:** Export workout sheets to PDF and print-friendly layouts for clients.

---

## Screenshots

| Dashboard & Plan Overview | Workout Plan & Client Management |
| :---: | :---: |
| ![GymIA Application Preview](frontend/public/images/Demo1.png) | ![GymIA Workout Details](frontend/public/images/Demo2.png) |

---

## Tech Stack & Architecture

```text
GymIA/
├── backend/                  # Node.js + Express API
│   ├── prisma/               # Prisma schema & MySQL migrations
│   ├── src/
│   │   ├── app/
│   │   │   ├── controllers/  # Auth, Clients, WorkoutPlans, Dashboard, Chat
│   │   │   ├── routes/       # Express route definitions
│   │   │   ├── services/     # Business logic & OpenAI service
│   │   │   └── middlewares/  # JWT auth & error handling
│   │   └── index.ts          # Server entrypoint
│   ├── docker-compose.yml    # Local MySQL container setup
│   └── .env.example          # Backend environment template
│
└── frontend/                 # React + Vite Client
    ├── src/
    │   ├── components/       # Reusable UI components & layouts
    │   ├── contexts/         # Authentication & preferences context
    │   ├── pages/            # Dashboard, Clients, WorkoutPlan, Chat, Login
    │   ├── services/         # Axios API client & endpoints
    │   └── styles/           # styled-components global theme
    ├── public/images/        # Demo previews & brand assets
    └── .env.example          # Frontend environment template
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+) and `npm`
- [Docker](https://www.docker.com/) & Docker Compose (or a local MySQL 8 instance)
- [OpenAI API Key](https://platform.openai.com/)

---

### 1. Database Setup (Docker)

Start the MySQL database container:

```bash
cd backend
docker compose up -d
```

---

### 2. Backend Setup

From the `backend/` directory:

1. Copy the environment template and fill in your keys:
   ```bash
   cp .env.example .env
   ```
2. Configure `.env`:
   ```dotenv
   DATABASE_URL="mysql://root:password@localhost:3306/gym"
   JWT_SECRET="your-super-secret-jwt-key"
   OPENAI_API_KEY="sk-..."
   OPENAI_FINE_TUNED_MODEL="ft:gpt-4o-mini-2024-07-18:your-org:model"
   PORT=3000
   ```
3. Install dependencies and apply Prisma database migrations:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API will be running at `http://localhost:3000`.

---

### 3. Frontend Setup

From the repository root, navigate to `frontend/`:

1. Copy the environment template:
   ```bash
   cd frontend
   cp .env.example .env
   ```
2. Configure `.env` (optional, defaults to `http://localhost:3000`):
   ```dotenv
   VITE_API_URL="http://localhost:3000"
   ```
3. Install dependencies and start the Vite development server:
   ```bash
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new instructor |
| `POST` | `/api/auth/login` | Authenticate instructor & return JWT |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/clients` | List instructor's clients |
| `POST` | `/api/clients` | Create new client |
| `GET` | `/api/dashboard/statistics` | Dashboard retention & inactivity statistics |
| `GET` | `/api/workout-plans` | List workout plans |
| `POST` | `/api/workout-plans` | Request AI-generated workout plan |
| `POST` | `/api/chat-sessions` | Create coaching chat session |
| `POST` | `/api/chat-sessions/:id/messages` | Send message in chat session |

---

## Security & Responsible Disclosure

- Never commit real credentials, API tokens, or production database strings.
- Always configure `.env` locally using the provided `.env.example` templates.
- Any generated workout recommendations must be evaluated and approved by a qualified personal trainer or fitness professional.

---

## License

This project is licensed under the [MIT License](LICENSE).

Developed by [João Gabriel Alves Junior](https://github.com/Gabrieljr42).