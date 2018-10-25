const jwt = require('jsonwebtoken');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URI);
const tokenExpiry = 60 * 60 * 24; // expires after a day

const createSession = user => {
    console.log('hit createSession');
    // JWT token, return user data
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => ({ success: 'true', user, token }))
        .catch(err => console.log(err));
};

const signToken = email => {
    console.log('hit signToken');
    const jwtPayload = { email };
    return jwt.sign({ jwtPayload }, process.env.JWT_SECRET, {
        expiresIn: tokenExpiry
    });
};

const setToken = async (key, value) => {
    console.log('hit setToken');
    console.log(key);
    console.log(value);
    await redisClient.set(key, value);
    return Promise.resolve(redisClient.expire(key, tokenExpiry));
};

module.exports = {
    createSession
};
