const User = require('../models/User');

const joinUser = async (username) => {
    try {
        let user = await User.findOne({ username });
        if (!user) {
            user = new User({ username, online: true });
        } else {
            user.online = true;
        }
        await user.save();
        return user;
    } catch (err) {
        throw err;
    }
};

const disconnectUser = async (username) => {
    try {
        await User.findOneAndUpdate(
            { username },
            { online: false }
        );
    } catch (err) {
        throw err;
    }
};

const getUsers = async () => {
    try {
        return await User.find({});
    } catch (err) {
        throw err;
    }
};

module.exports = {
    joinUser,
    disconnectUser,
    getUsers
};