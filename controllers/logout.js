const redisClient = require('./signin').redisClient;

const handleSignout = async (req, res, db) => {
    const { id } = req.params;
    const { authorization } = req.headers;

    redisClient.del(authorization, (err, reply) => {
        if (err || !reply) {
            console.log('');
            return res.status(401).json('Something went wrong');
        }
        return res.json('successfully logged you out');
    });
};

module.exports = {
    handleSignout
};
