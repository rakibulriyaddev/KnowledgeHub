---
title: "Case Study: WhatsApp / Messenger — Deep Dive"
---

WhatsApp - it's on almost everyone's phone in Bangladesh. 2 billion active users, 100+ billion messages every day. A team of just 100 people handled this scale. How? Engineering brilliance + the right architecture choices.

## Step 1: Requirements

### Functional

- 1-on-1 chat.
- Group chat.
- Online/last seen status.
- Read receipts (✓✓).
- Media sharing (image, video).
- Voice/video calling.
- End-to-end encryption.

### Non-Functional

- Real-time delivery (<100ms).
- Massive scale (2B+ users).
- High availability.
- Reliable delivery (no lost messages).
- Low data usage.

## Step 2: Capacity Estimation

```
DAU: 2B
Messages/day: 100B
Messages/sec: 100B / 86400 ≈ 1.16M msg/sec

Per message: ~100 bytes (text)
Per day: 100B × 100 bytes = 10TB messages
Plus media: 5x = 50TB/day

Concurrent connections (WebSocket): ~500M
Connection servers: ~250 (2M conn each - Erlang)
```

## Step 3: API Design

```
// Client connects via WebSocket
WS connection: wss://chat.whatsapp.com

// Send message
SEND { to: userId, content: "..." }

// Server pushes
RECEIVE { from: userId, content: "...", timestamp }

// Status updates
TYPING, READ, ONLINE
```

## Step 4: Data Model

```
User: { id, phone, name, status, last_seen }
Conversation: { id, type (1on1/group), participants[] }
Message: {
  id, conv_id, sender_id,
  encrypted_content, timestamp,
  delivery_status
}
Group: { id, name, admin, members[] }
```

Message history is stored on the client; the server holds it only temporarily.

## Step 5: Architecture

```
[Mobile Client]
  ↓ WebSocket (TLS)
[Load Balancer] (geo-routed)
  ↓
[Chat Server (Erlang)] ←→ [Cluster Coordination]
  ↓
[Message Queue] (Kafka)
  ↓
[Storage]: Cassandra (history), Redis (online state)
[Media]: CDN + Object Storage (S3)
```

## Why Erlang?

WhatsApp runs on the Erlang/BEAM VM. Because:

- **Massive concurrency:** Lightweight processes - 2 million per server.
- **Fault tolerance:** "Let it crash" philosophy + supervisor tree.
- **Hot code reload:** Live updates - no downtime.
- **Built for telecom:** A native fit for real-time messaging.

Result: 10-20 engineers managing 1+ billion users.

## Message Delivery Flow

### 1-on-1 Chat

1. User A sends "Hello".
2. The app encrypts the message over WebSocket.
3. Chat server receives it - stores the encrypted message (for offline delivery).
4. If User B is online - push notification + message.
5. User B's app decrypts the encrypted message.
6. Acknowledgment back: ✓ (sent) → ✓✓ (delivered) → ✓✓ blue (read).
7. Once both are online - the server deletes the message (privacy + storage).

### Offline Delivery

- User offline → message queued.
- When online → APNs/FCM push notification.
- App connects → queued messages delivered.

## End-to-End Encryption

Signal Protocol (Open Whisper Systems):

- **Identity keys:** Long-term, per user.
- **Pre-keys:** Short-term, server-stored.
- **Session keys:** Per-conversation.
- **Forward secrecy:** Past messages stay secure - even if the current key is compromised.

**Important:** The WhatsApp server cannot decrypt messages - only the sender and recipient can.

## Online Presence

- WebSocket connect = online state stored in Redis.
- Disconnect = offline.
- Last seen timestamp stored.
- Privacy settings respected.

## Group Chat

- Group → message → server fans out to all members.
- Each member gets an encrypted copy.
- Maximum 1024 members (currently).
- Admin permissions.

## Media Handling

1. Sender uploads the file - temporary URL.
2. Encrypted upload to CDN/S3.
3. The message in the chat = link + key.
4. Receiver downloads + decrypts.
5. Compression (image, video) saves bandwidth.

## Voice/Video Call

- WebRTC - typically peer-to-peer.
- NAT traversal: STUN/TURN servers.
- Codec: Opus (audio), VP8/H.264 (video).
- Encrypted media stream.

## Scaling Challenges

### Connection Scale

- 500M concurrent WebSocket connections.
- Erlang's advantage is huge here.
- Sticky session per user.

### Storage

- Server-side storage is temporary only.
- History lives on the client device.
- Cassandra cluster - undelivered messages.

### Geographic Distribution

- Multiple data centers.
- User connects to the nearest server.
- Cross-DC routing for distant users.

## Key Trade-offs

- Server-side message storage vs E2E encryption privacy.
- Real-time push vs battery life.
- Delivery guarantee vs simplicity.
- Group size limit vs broadcast cost.

## Real World Numbers

- 2 billion+ users.
- 100+ billion messages/day.
- Relatively small Erlang server fleet.
- WhatsApp was acquired by FB in 2014 (€19B).
- Reached 500M+ users with just ~50 engineers.

## Engineering Lessons

1. Right tool: Erlang for messaging.
2. Simplicity scales.
3. Server-light, client-heavy.
4. Encryption from the start.
5. Reliable > feature-rich.

## Chapter Summary

- WhatsApp = WebSocket + Erlang + E2E encryption.
- Server stores temporarily; client stores persistently.
- Signal Protocol - forward secrecy.
- Group chat = server fan-out + per-member encryption.
- Media = CDN + encrypted upload.
