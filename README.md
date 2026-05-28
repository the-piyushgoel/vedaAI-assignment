# VedaAI – AI Assessment Creator

VedaAI is a production-quality, full stack web application designed for educators to easily configure, generate, track, and export AI-based academic question papers and answer keys.

The platform focuses on scalable architecture, realtime communication, AI-assisted workflows, and clean responsive UI implementation inspired by modern EdTech platforms.

---

# Architecture Overview

VedaAI consists of two primary components:

1. Frontend
2. Backend

The frontend is built using Next.js 15 (App Router) with Tailwind CSS, Zustand, Axios, React Hook Form, Zod validation, Framer Motion, and Socket.io-client.

The backend is powered by Node.js, Express, TypeScript, MongoDB, Redis, BullMQ, Socket.io, and OpenAI-compatible APIs.

---

# Features

- Pixel-perfect implementation inspired by the provided Figma design
- Fully responsive layout (desktop + tablet + mobile)
- AI-powered question paper generation
- Dynamic question configuration system
- Realtime generation tracking using WebSockets
- Background processing using BullMQ queues
- Structured section-wise question rendering
- Difficulty tagging (Easy / Medium / Hard)
- PDF-ready printable exam sheet layout
- Zustand-powered centralized frontend state management
- Form validation with React Hook Form + Zod
- File upload support for reference material
- Retry-safe background generation architecture
- Graceful fallback demo mode when API keys are unavailable

---

# Application Workflow

## Step 1 — Teacher Input

The teacher creates an assignment by:
- selecting subject
- uploading reference material
- configuring question patterns
- setting marks distribution
- adding instructions

---

## Step 2 — Validation

Frontend validation is handled using:
- React Hook Form
- Zod schema validation

This prevents:
- empty submissions
- invalid marks
- incorrect question counts
- malformed input payloads

---

## Step 3 — API Request

Validated data is sent to the backend using Axios through:

```bash
POST /api/assignments/create
```

---

## Step 4 — Queue Processing

The backend:
- creates an assignment document in MongoDB
- sets initial status to pending
- pushes a generation task into the BullMQ queue

Queue Name:

```bash
question-generation
```

Redis is used as the queue broker.

---

## Step 5 — AI Generation

The worker:
- pulls jobs from Redis
- constructs structured prompts
- sends prompts to the OpenAI-compatible API
- parses structured JSON responses
- validates response integrity

The application avoids rendering raw LLM output directly.

---

## Step 6 — Realtime Updates

Socket.io is used for realtime progress updates.

Example events:
- generation-progress
- generation-completed
- generation-failed

The frontend listens to these events and updates the UI dynamically.

---

## Step 7 — Rendering

Generated exam papers are:
- grouped into sections
- assigned difficulty levels
- rendered using responsive exam-paper layouts
- prepared for PDF export

---

# Tech Stack

## Frontend

- Next.js 15+
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- React Hook Form
- Zod
- Framer Motion
- Lucide Icons
- Socket.io-client
- @react-pdf/renderer

---

## Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Redis
- BullMQ
- Socket.io
- OpenAI SDK

---

# Project Structure

```bash
VedaAI/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── store/
│   ├── lib/
│   ├── types/
│   └── public/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── workers/
│   │   ├── socket/
│   │   ├── queues/
│   │   ├── prompts/
│   │   ├── models/
│   │   └── utils/
│   │
│   └── dist/
│
└── README.md
```

---

# Key Engineering Decisions

## Why BullMQ?

Question generation can take several seconds depending on AI latency. BullMQ prevents HTTP timeout issues and enables scalable background processing.

---

## Why Socket.io?

Realtime updates improve UX significantly during long-running AI generation tasks by providing live progress updates.

---

## Why Zustand Instead of Redux?

Zustand provides lightweight state management with:
- minimal boilerplate
- easier integration
- cleaner realtime synchronization

---

## Why Structured Prompting?

The backend converts teacher input into strict schema-guided prompts to ensure:
- predictable structure
- easier parsing
- stable rendering
- clean PDF generation

---

## Why Parse AI Responses Instead of Rendering Raw Text?

Directly rendering raw LLM responses is unreliable.

Structured parsing ensures:
- consistent rendering
- predictable UI behavior
- better production stability

---

# Environment Configuration

Create a `.env` file inside the `backend/` directory.

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vedaal
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
OPENAI_API_KEY=your_openai_api_key
```

---

# Installation & Setup

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# WebSocket Events

## Client Events

- join-assignment

---

## Server Events

- generation-progress
- generation-completed
- generation-failed

---

# Queue Architecture

BullMQ workers:
- isolate AI processing
- prevent request blocking
- handle retries safely
- improve scalability

Redis is used for:
- queue state
- worker communication
- job persistence

---

# AI Generation Flow

1. Extract teacher input
2. Build structured AI prompt
3. Send request to OpenAI-compatible API
4. Receive JSON response
5. Parse & validate sections
6. Store paper in MongoDB
7. Render exam paper UI

---

# Deployment

## Recommended Frontend Hosting

- Vercel
- Netlify

---

## Recommended Backend Hosting

- Render
- Railway

---

## Recommended Production Services

- MongoDB Atlas
- Redis Cloud
- OpenRouter / OpenAI API

---

# Notes

This project was designed and engineered as part of the VedaAI Full Stack Engineering Assignment with a focus on:
- scalable architecture
- realtime communication
- responsive UI implementation
- background job processing
- structured AI generation workflows