/**
 * Axios instance + typed request functions for the StegoArt backend.
 *
 * Every function here returns the parsed response data on success and
 * throws an ApiError (with a clean, user-facing `.message`) on failure —
 * callers never need to touch axios/fetch internals directly.
 */
import axios from "axios";

// In production (Vercel), set VITE_API_BASE_URL to your backend's public
// HTTPS URL (e.g. https://api.yourdomain.com) as a project environment
// variable. Falls back to the local FastAPI dev server when unset.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Mirrors backend/utils/validation.py exactly (ALLOWED_IMAGE_FORMATS / MAX_FILE_SIZE_BYTES).
// Client-side checks here are a UX convenience (fail fast, no round trip) —
// the backend re-validates independently and is the actual source of truth.
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

// Not exposed by any backend endpoint (no GET /api/config), so this is
// hardcoded to match ml/config.py's MAX_TEXT_CHARS (= (64*64 - 16) // 8).
// If Phase 1's SECRET_MAP_GRID/HEADER_BITS ever change, update this too —
// the backend's own /api/encode validation is the real enforcement; this
// number only drives the live character counter's UX.
export const MAX_TEXT_CHARS = 510;

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function unwrapError(error) {
  if (error.response) {
    const detail = error.response.data?.detail;
    const message = typeof detail === "string" ? detail : `Request failed (${error.response.status})`;
    return new ApiError(message, error.response.status);
  }
  if (error.request) {
    return new ApiError("Could not reach the server — is the backend running at " + API_BASE_URL + "?", 0);
  }
  return new ApiError(error.message ?? "Unknown error", 0);
}

/**
 * POST /api/encode
 * @param {{coverImage: File, secretText: string, applyStyle?: boolean, styleName?: string}} params
 */
export async function encodeSecret({ coverImage, secretText, applyStyle, styleName }) {
  const form = new FormData();
  form.append("cover_image", coverImage);
  form.append("secret_text", secretText ?? "");
  form.append("apply_style", applyStyle ? "true" : "false");
  if (applyStyle && styleName) {
    form.append("style_name", styleName);
  }

  try {
    const { data } = await http.post("/api/encode", form);
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

/**
 * POST /api/decode
 * @param {{stegoImage: File}} params
 */
export async function decodeSecret({ stegoImage }) {
  const form = new FormData();
  form.append("stego_image", stegoImage);

  try {
    const { data } = await http.post("/api/decode", form);
    return data;
  } catch (error) {
    throw unwrapError(error);
  }
}

/** GET /api/styles -> [{ name, thumbnail_url }] */
export async function getStyles() {
  try {
    const { data } = await http.get("/api/styles");
    return data.styles;
  } catch (error) {
    throw unwrapError(error);
  }
}

/** Full URL for a style's preview thumbnail (GET /api/styles/{name}/thumbnail). */
export function getStyleThumbnailUrl(name) {
  return `${API_BASE_URL}/api/styles/${name}/thumbnail`;
}

/** "data:image/png;base64,...." data-URL for a base64 PNG payload the API returned. */
export function toPngDataUrl(base64) {
  return `data:image/png;base64,${base64}`;
}

/** Converts a base64 PNG payload from an API response into a File, so it
 * can be fed straight back into another request (e.g. Hide Flow's result ->
 * "Try Extracting This Image" deep link into Extract Flow). */
export function base64PngToFile(base64, filename = "stego.png") {
  const byteChars = atob(base64);
  const bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
  return new File([bytes], filename, { type: "image/png" });
}
