const authService = require('../services/auth.service');
const chatService = require('../services/chat.service');

const configureChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // User joins
        socket.on('join', async (username) => {
            try {
                const user = await authService.joinUser(username);
                socket.username = username;
                // Join a room specific to this user
                socket.join(username);  // Using username as room ID
                io.emit('user status', { username, online: true });
            } catch (err) {
                console.error('Error joining:', err);
            }
        });

        // Typing indicators
        socket.on('typing', (data) => {
            // Send only to the intended recipient
            io.to(data.to).emit('user typing', {
                from: socket.username,
                to: data.to,
                isTyping: true
            });
        });

        socket.on('stop typing', (data) => {
            io.to(data.to).emit('user typing', {
                from: socket.username,
                to: data.to,
                isTyping: false
            });
        });

        // In your socket.io server code
        socket.on('send message', async (data) => {
            try {
                const message = await chatService.saveMessage(data);

                // Send to sender (optional if you want them to see their own message)
                socket.emit('receive message', message);

                // Send to recipient using their room
                io.to(data.to).emit('receive message', message);

            } catch (err) {
                console.error('Error sending message:', err);
            }
        });

        socket.on('get history', async (data) => {
            try {
                const messages = await chatService.getChatHistory(data.user1, data.user2);
                // Send only to the requesting client
                socket.emit('chat history', messages);
            } catch (err) {
                console.error('Error fetching history:', err);
            }
        });

        // Disconnect
        socket.on('disconnect', async () => {
            if (socket.username) {
                try {
                    await authService.disconnectUser(socket.username);
                    io.emit('user status', {
                        username: socket.username,
                        online: false
                    });
                } catch (err) {
                    console.error('Error updating status:', err);
                }
            }
            console.log('Client disconnected:', socket.id);
        });
    });
};

module.exports = configureChatSocket;