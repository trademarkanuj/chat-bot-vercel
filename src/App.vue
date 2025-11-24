<template>
  <div class="app-container">
    <aside class="sidebar">
      <header class="sidebar-header">
        <h2>Chats</h2>
        <button @click="newChat">+ New</button>
      </header>

      <ul class="chat-list">
        <li
          v-for="chat in chatSessions"
          :key="chat.id"
          :class="{ active: chat.id === currentSessionId }"
          @click="selectChat(chat.id)"
        >
          <div class="chat-title">{{ chat.title || "Untitled" }}</div>
          <!-- <div class="chat-last">{{ chat.last_message || "No messages yet" }}</div> -->
        </li>
      </ul>
    </aside>

    <main class="chat-main">
      <header class="chat-header">
        <h1>Welcome to Tethr</h1>
      </header>

      <section class="messages">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['message', msg.role]"
        >
          <!-- <strong>{{ msg.role === 'user' ? 'You' : 'Bot' }}:</strong> -->
          <span>{{ msg.content }}</span>
        </div>
      </section>

      <form class="input-area" @submit.prevent="handleSend">
        <input
          v-model="userInput"
          placeholder="Type your message..."
          :disabled="loading"
        />
        <button type="submit" :disabled="loading || !userInput.trim()">
          {{ loading ? "Sending..." : "Send" }}
        </button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  sendMessage,
  getChatSessions,
  getChatSession,
} from "./api";

const chatSessions = ref([]);
const currentSessionId = ref(null);
const messages = ref([]);
const userInput = ref("");
const loading = ref(false);

async function loadSessions() {
  const res = await getChatSessions();
  chatSessions.value = res.data;
}

async function selectChat(id) {
  currentSessionId.value = id;
  const res = await getChatSession(id);
  messages.value = res.data.messages;
}

async function handleSend() {
  if (!userInput.value.trim()) return;

  loading.value = true;
  try {
    const res = await sendMessage(currentSessionId.value, userInput.value);
    const session = res.data.session;
    currentSessionId.value = session.id;
    messages.value = session.messages;
    await loadSessions();
    userInput.value = "";
  } catch (err) {
    console.error(err);
    alert("Error sending message");
  } finally {
    loading.value = false;
  }
}

function newChat() {
  currentSessionId.value = null;
  messages.value = [];
  userInput.value = "";
}

onMounted(async () => {
  await loadSessions();
});
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  font-family: system-ui, sans-serif;
}

.sidebar {
  width: 280px;
  border-right: 1px solid #ddd;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.chat-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}

.chat-list li {
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 4px;
}

.chat-list li.active {
  background: #f0f0f0;
}

.chat-title {
  font-weight: 600;
  font-size: 14px;
}

.chat-last {
  font-size: 12px;
  color: #666;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
}

.messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  max-width: 70%;
  padding: 8px 10px;
  border-radius: 8px;
}

.message.user {
  background: #d1e7ff;
  align-self: flex-end;
}

.message.assistant {
  background: #ffffff;
  align-self: flex-start;
}

.input-area {
  display: flex;
  padding: 12px;
  border-top: 1px solid #ddd;
  gap: 8px;
}

.input-area input {
  flex: 1;
  padding: 8px;
}

.input-area button {
  padding: 8px 16px;
}
</style>
