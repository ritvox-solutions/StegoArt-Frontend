# StegoArt — Frontend

> Part of the StegoArt project (3 separate repos: `frontend`, `backend`,
> `ml`). For clone/setup instructions covering all three, see the
> [root README](../README.md).

React + Vite + Tailwind CSS v4 UI for StegoArt: hide a text or image secret
inside a cover photo, then extract it back. Also lets you render an
artistic-style copy of the stego image via neural style transfer (display
only — see the note below).

## Clone

```bash
git clone <frontend-repo-url> frontend
cd frontend
```

This repo only runs the UI — it talks to the backend over HTTP(S) using
whatever URL `VITE_API_BASE_URL` is set to (see Setup below), so it doesn't
need the `backend` or `ml` repos cloned alongside it. For local development
against a backend running on the same machine, see the
[root README](../README.md).

## Stack

- React 19 + React Router 7
- Vite 8 (dev server, build)
- Tailwind CSS v4 (CSS-first `@theme` tokens, no `tailwind.config.js`)
- axios for API calls
- Oxlint for linting

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
```

Requires the backend running at `http://127.0.0.1:8000` (see `../backend`).
The dev server's origin is already whitelisted in the backend's CORS config,
so no proxy setup is needed.

Other scripts:

```bash
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run lint        # oxlint
```

## Structure

```
src/
  pages/            Home, HideFlow (5-step wizard), ExtractFlow (3-step wizard), About
  components/       UploadDropzone, StyleGallery, MetricsPanel, ConfidenceMeter, ...
  state/            React Context providers — wizard state persists across route changes
  api/client.js      encodeSecret(), decodeSecret(), getStyles(), base64/PNG helpers
public/
  favicon.svg        also reused inline as the nav logo
```

## Notes

- `MAX_TEXT_CHARS` in `api/client.js` is hardcoded to match the backend's
  `ml/config.py` text-secret capacity (510 chars) — if that constant ever
  changes on the backend, update it here too.
- A styled stego image can't be decoded — the UI surfaces this via
  `styled_decode_supported` on the encode response rather than assuming it
  locally (see `components/StyledDecodeNotice.jsx`).
