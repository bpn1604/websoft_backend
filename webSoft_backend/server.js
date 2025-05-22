const app = require('./app');
const http = require('http');
const configureChatSocket = require('./sockets/chat.socket');

const server = http.createServer(app);
// In your Node.js server file (server.js or app.js)
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000", // Your React app's exact origin
        methods: ["GET", "POST"],
        credentials: true
    },
    allowEIO3: true // For Socket.IO v2 client compatibility if needed
});

// Configure socket.io
configureChatSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});