import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

export function sendMessage(sessionId, message) {
  return api.post("/chat/", {
    session_id: sessionId || null,
    message,
  });
}

export function getChatSessions() {
  return api.get("/chat-sessions/");
}

export function getChatSession(id) {
  return api.get(`/chat-sessions/${id}/`);
}

export function getChatHistory() {
  return api.get("/chat-history/");
}

export default api;
