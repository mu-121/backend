# Chat API Quick Reference

## 🔗 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication
All requests require:
```
Authorization: Bearer <your-jwt-token>
```

---

## 📡 REST API Endpoints

### Chat Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/api/chat` | Create or access a chat | `{ "userId": "string" }` |
| `GET` | `/api/chat` | Get all user's chats | - |

### Message Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/api/message` | Send a message | `{ "content": "string", "chatId": "string" }` |
| `GET` | `/api/message/:chatId` | Get messages for a chat | - |

---

## 🔌 Socket.IO Events

### Server URL
```
http://localhost:5000
```

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join_chat` | `chatId` (string) | Join a chat room |
| `send_message` | `{ chat: string, content: string, ... }` | Send a message |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `receive_message` | `{ _id, sender, content, chat, createdAt }` | Receive new message |
| `connect` | - | Socket connected |
| `disconnect` | - | Socket disconnected |

---

## 📦 Data Models

### Chat Object
```javascript
{
  _id: "chat-id",
  users: [
    {
      _id: "user-id",
      name: "User Name",
      email: "user@example.com"
    }
  ],
  latestMessage: {
    _id: "message-id",
    content: "Last message",
    sender: {...},
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### Message Object
```javascript
{
  _id: "message-id",
  sender: {
    _id: "sender-id",
    name: "Sender Name",
    email: "sender@example.com"
  },
  content: "Message content",
  chat: {
    _id: "chat-id",
    users: [...]
  },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

---

## 💡 Quick Implementation Checklist

- [ ] Install `socket.io-client` and `axios`
- [ ] Create API service with authentication
- [ ] Create Socket service
- [ ] Set up Chat Context/Provider
- [ ] Create ChatList component
- [ ] Create ChatWindow component
- [ ] Handle socket connection/disconnection
- [ ] Join chat rooms when selecting chat
- [ ] Send messages via REST API + Socket
- [ ] Listen for incoming messages
- [ ] Update UI in real-time

---

## 🚨 Common Issues

1. **CORS Error**: Backend CORS configured for `http://localhost:5173` ✅
2. **Socket Not Connecting**: Check server is running on port 5000
3. **401 Unauthorized**: Verify token is included in headers
4. **Messages Not Real-time**: Ensure socket events are properly set up

