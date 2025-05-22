const Message = require('../models/Message');

const saveMessage = async (data) => {
    try {
        const message = new Message({
            sender: data.from,
            receiver: data.to,
            content: data.message
        });
        await message.save();
        return message;
    } catch (err) {
        throw err;
    }
};

const getChatHistory = async (user1, user2) => {
    try {
        return await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort('createdAt');
    } catch (err) {
        throw err;
    }
};

module.exports = {
    saveMessage,
    getChatHistory
};
