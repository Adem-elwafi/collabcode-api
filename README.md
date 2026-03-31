# CollabCode Monorepo

This repository contains both projects under one root folder:

```
/collabcode
├── /collabcode-api      # Spring Boot backend
├── /collabcode-ui       # React/Vite frontend
├── docker-compose.yml   # MySQL + backend + frontend orchestration
└── README.md            # This file
```

## 1) Restructure Steps

If your backend currently lives at repository root, move it into `collabcode-api`.

Example:

```bash
mkdir collabcode-api
# Move backend files into collabcode-api/
# (pom.xml, mvnw, src/, etc.)
```

If your frontend does not exist yet, create it inside `collabcode-ui`:

```bash
npm create vite@latest collabcode-ui -- --template react
cd collabcode-ui
npm install
```

In this workspace, that structure is already in place.

## 2) Frontend API Proxy (Vite)

File: `collabcode-ui/vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

With this config, calls like `fetch('/api/...')` from the frontend are forwarded to the backend on port 8080.

## 3) Run Everything with Docker Compose

From repository root (`/collabcode`):

```bash
docker compose up --build
```

Services:
- MySQL: `localhost:3306`
- Spring Boot API: `http://localhost:8080`
- Vite frontend: `http://localhost:5173`

Stop stack:

```bash
docker compose down
```

Stop stack and remove DB volume:

```bash
docker compose down -v
```

## 4) Run Projects Separately (No Docker)

### Backend

```bash
cd collabcode-api
mvn spring-boot:run
```

Backend defaults in `application.yml`:
- URL: `jdbc:mysql://localhost:3306/collabcode_db...`
- User: `root`
- Password: empty by default

You can override with environment variables:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

### Frontend

```bash
cd collabcode-ui
npm install
npm run dev
```

Open:
- Frontend: `http://localhost:5173`
- API: `http://localhost:8080`

## 5) Useful Commands

```bash
# Rebuild and restart everything
docker compose up --build -d

# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```
