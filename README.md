# WebSocket Server

This folder contains all WebSocket-related files for the Socket.IO server.

## Files

- `server.js` - Main Socket.IO server file

## Running the Server

### Production Mode
```bash
npm run socket
```

### Development Mode (with auto-reload)
```bash
npm run socket:dev
```

## Server Configuration

- **Port**: 3000
- **Host**: 0.0.0.0 (accessible from all network interfaces)
- **CORS**: Enabled for all origins

## Events

### Client → Server
- `login` - User login event
- `joinRoom` - Join a chat room
- `send_message` - Send a message
- `disconnect` - User disconnection

### Server → Client
- `receive_message` - Receive a new message notification

## API Integration

The server integrates with the Laravel API at `http://10.0.2.2:8000/api` to update user status.

