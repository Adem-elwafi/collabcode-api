# Frontend State Report

Date: 2026-04-11

## Overview

The frontend is currently a React 19 + TypeScript + Vite application built around a collaborative code editor experience with a JWT authentication foundation. The app has dedicated login and signup screens, stores the access token locally, and now gates workspace mounting on confirmed WebSocket readiness.

Sprint 2.1 (Sync & Recovery) is now integrated on the frontend:

- Join flow waits for real socket connection success
- Active room session is persisted in `sessionStorage` and auto-restored
- Remote cursor movement is broadcast and rendered in Monaco via decorations

The visual direction is a dark, modern interface with glassmorphism treatment on the entry card, layered gradients in the shell, and a short entrance transition when the editor mounts.

## Current Stack

- React 19
- TypeScript
- Vite
- Monaco editor via `@monaco-editor/react`
- WebSocket messaging via `sockjs-client` and `@stomp/stompjs`
- Iconography via `lucide-react`

## Application Flow

### 1. Entry Gate

The app now renders a join screen before the workspace mounts and can hydrate a room from the browser URL.

Authentication screens are now part of the entry flow:

- `Login.tsx`
- `Signup.tsx`

Both screens use the same glassmorphism card styling as the join form.

The join screen collects:

- Username
- Room ID

When the user clicks Join Workspace, the app sets `isJoining=true`, opens a WebSocket connection, and only sets `isJoined=true` after `WebSocketService.connect(...)` resolves.

If the URL contains `?room=XYZ`, the room field is prefilled from that query parameter so shared links can open directly into the same room.

If no JWT token exists in `localStorage`, the app redirects immediately to `/login`. Logged-in users can access the join screen and editor workspace; unauthenticated users cannot.

### 2. Join State and Persistence

The top-level app state now includes:

- `currentUser`
- `roomId`
- `isJoined`
- `isJoining`
- `users`
- `saveStatus`
- `accessToken` via `AuthContext`

Username persistence is handled through `localStorage` using the key `collabcode.username`. The stored username is restored on refresh, so the user does not need to re-enter it every time.

Room ID is kept in component state for the active session, but it now hydrates from the `room` query parameter and is cleared on Leave Room.

The active room is now persisted with `sessionStorage` key `collabcode.activeRoomId` and is restored on app mount when both token and room are present.

The access token is persisted separately through `localStorage` using `collabcode.accessToken` and is read by a shared fetch wrapper that automatically attaches `Authorization: Bearer ...` to protected requests.

### 3. Workspace Mounting

Once joined, the app renders `MainLayout`, which contains:

- `Sidebar`
- `CodeEditor`
- `StatusBar`

The workspace container uses a simple CSS entrance animation so the editor fades/slides into view after join.

Mounting behavior now supports session recovery:

- If token + room session exist, App attempts websocket connect immediately
- Join screen is bypassed on successful reconnect
- Room session is cleared on leave or unauthenticated state

## Component Breakdown

### `App.tsx`

The top-level shell is responsible for:

- Loading the saved username
- Enforcing protected routes for `/login` and `/signup`
- Managing join/loading state tied to real socket readiness
- Saving username updates to `localStorage`
- Persisting active room ID in `sessionStorage`
- Auto-restoring an active room session on mount
- Switching between the join screen and the workspace
- Passing room/user state into the editor layout
- Reading the active token from `AuthContext`

### `JoinRoom.tsx`

The new gate component provides:

- Centered card-based layout
- Glassmorphism styling
- Username and Room ID inputs
- Gradient join button
- Loading indicator during connection delay

### `Login.tsx`

The login page provides:

- Username/email and password fields
- Submission to the Spring Boot auth endpoint
- Token persistence on success
- Redirect back into the app once authenticated

### `Signup.tsx`

The signup page provides:

- Username, email, and password fields
- Submission to the Spring Boot register endpoint
- Token persistence on success
- Redirect back into the app once authenticated

### `MainLayout.tsx`

The workspace layout still owns the editor shell composition:

- Sidebar for room info and active users
- Main editor region
- Footer-style status bar

### `CodeEditor.tsx`

The editor component remains the core collaboration surface.

Current behavior:

- Subscribes to room updates through an already-connected websocket session
- Handles JOIN and LEAVE presence messages
- Handles CODE_UPDATE payloads
- Listens to Monaco `onDidChangeCursorPosition`
- Publishes `CURSOR_MOVE` events with `lineNumber` and `column`
- Renders remote cursors from other users with `editor.deltaDecorations`
- Keeps the local editor content and save state in sync

### `Sidebar.tsx`

The sidebar shows:

- Current room ID
- Share button for the room URL
- Leave Room button
- Active users list

### `UserList.tsx`

The user list merges the current user with remote users and highlights the current user entry as `you`.

### `StatusBar.tsx`

The status bar displays:

- Room ID
- Save state
- Encoding indicator

### `WebSocketService.ts`

The websocket layer is a singleton service built on STOMP over SockJS.

Current responsibilities:

- Connect with a Bearer JWT header and return a `Promise<void>` that resolves on STOMP `onConnect`
- Subscribe to room topics
- Publish editor updates
- Publish cursor updates (`CURSOR_MOVE`)
- Expose room unsubscription for editor lifecycle cleanup
- Cleanly disconnect and unsubscribe on teardown

Outbound editor payloads now use the active `currentUser` as the sender instead of a hardcoded placeholder.

### `AuthContext.tsx`

The auth context now owns:

- Reading and storing the access token in `localStorage`
- Exposing `login`, `signup`, and `logout`
- Normalizing backend responses that return either `token` or `accessToken`
- Redirecting unauthenticated users to `/login`

### `apiClient.ts`

The shared fetch wrapper now:

- Uses `http://localhost:8080` as the API base URL
- Automatically adds the stored JWT as a Bearer token
- Supports auth endpoint fallback between `/api/v1/auth/*` and `/api/auth/*`

## Visual Design State

The current styling is intentionally darker and more atmospheric than the original shell.

Key UI traits:

- Full-screen gradient background
- Glassmorphism join card
- Blue-to-purple primary action button
- Soft blur/glow decoration around the shell
- Fade/slide transition when the workspace mounts

The UI is implemented with plain CSS only. No animation library is installed, so the transition is intentionally lightweight.

## Persistence And Connection Notes

What is persisted:

- Username in `localStorage`
- Access token in `localStorage`
- Active room ID in `sessionStorage`

What is not persisted yet:
- Room editor session state across refreshes
- Full unsaved editor buffer snapshot across refreshes

Current connection assumptions:

- Backend websocket endpoint: `http://localhost:8080/ws`
- Room topic pattern: `/topic/room/{roomId}`
- Editor publish destination: `/app/editor.sendMessage/{roomId}`
- Auth register endpoint: `http://localhost:8080/api/v1/auth/register`
- Auth login endpoint: `http://localhost:8080/api/v1/auth/authenticate`

## Build Status

The frontend was validated with a successful production build:

- `npm run build` completed successfully on 2026-04-11

## Known Gaps

These are the main follow-up items if the frontend is meant to become production-ready:

- The current auth flow still relies on browser redirects instead of a router-driven navigation stack
- Remote cursor styling currently uses a single color for all users (no per-user color mapping)
- Backend enum support must include `CURSOR_MOVE` for end-to-end cursor sync

## Summary

The frontend is now structured around a proper entry portal, persistent username capture, URL-aware room hydration, and a JWT-backed auth flow. With Sprint 2.1, join now waits for true WebSocket readiness, room sessions are recoverable after refresh, and real-time remote cursor indicators are integrated into the collaborative editor.