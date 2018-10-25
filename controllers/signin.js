const jwt = require('jsonwebtoken');
const redis = require('redis');
const tokenExpiry = 60 * 60 * 24; // expires after a day

// setup redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject('incorrect form submission');
    }
    return db
        .select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db
                    .select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => user[0])
                    .catch(err => Promise.reject('unable to get user'));
            } else {
                Promise.reject('wrong credentials');
            }
        })
        .catch(err => Promise.reject('wrong credentials'));
};
const getAuthTokenId = (req, res, next) => {
    const { authorization } = req.headers;
    redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(400).json('Unauthorized');
        }
        return res.json({ id: reply });
    });
};

const signToken = email => {
    const jwtPayload = { email };
    return jwt.sign({ jwtPayload }, process.env.JWT_SECRET, {
        expiresIn: tokenExpiry
    });
};

const setToken = async (key, value) => {
    await redisClient.set(key, value);
    return Promise.resolve(redisClient.expire(key, tokenExpiry));
};

const createSession = user => {
    // JWT token, return user data
    console.log('inside create session');
    const { email, id } = user;
    const token = signToken(email);
    console.log('email', token);
    return setToken(token, id)
        .then(() => ({ success: 'true', userId: id, token }))
        .catch(err => console.log(err));
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    console.log(authorization);
    return authorization
        ? getAuthTokenId(req, res)
        : handleSignin(db, bcrypt, req, res)
              .then(
                  data =>
                      data.id && data.email
                          ? createSession(data)
                          : Promise.reject(data)
              )
              .then(session => res.json(session))
              .catch(err => res.status(400).json(err));
};

module.exports = {
    signinAuthentication,
    redisClient
};
