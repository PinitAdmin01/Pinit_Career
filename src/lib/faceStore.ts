// Server-side in-memory face template store (shared between enroll & verify routes)
// In production, this should be persisted in Supabase user profile metadata
const faceTemplateStore = new Map<string, number[]>();

export default faceTemplateStore;
