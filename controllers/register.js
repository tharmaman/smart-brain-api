const jwt = require('jsonwebtoken');
const redisClient = require('./signin').redisClient;
const tokenExpiry = 60 * 60 * 24; // expires after a day

const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return Promise.reject('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    return db
        .transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0],
                            name: name,
                            joined: new Date()
                        })
                        .then(user => {
                            return user[0];
                        });
                })
                .then(trx.commit)
                .catch(trx.rollback);
        })
        .catch(err => Promise.reject('unable to register'));
};

const createSession = user => {
    // JWT token, return user data
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => ({ success: 'true', user, token }))
        .catch(err => console.log(err));
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

const registerAuthentication = (db, bcrypt) => (req, res) => {
    return handleRegister(req, res, db, bcrypt)
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
    registerAuthentication,
};
