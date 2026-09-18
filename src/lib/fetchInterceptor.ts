// Intercepts all fetch('/api/*') calls and routes them to our Firestore client
// This patches the global fetch so we don't have to change every component
import { api } from './api/client';

let installed = false;

export function installFetchInterceptor() {
  // On Vercel, server routes in /api/* are fully active.
  // Native window.fetch communicates directly with the authoritative backend without browser hijacking.
  if (installed || typeof window === 'undefined') return;
  installed = true;
}
