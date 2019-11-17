const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function hashPassword(password) {
    return (async () => {
        let salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt)
    })();
}

function comparePassword(plain, hash) {
    return (async () => {
        return await bcrypt.compare(plain, hash);
    })()
}

function generateToken(user) {
    const userObj = {username: user.username}
    return jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET)
}

/**
 * authentication middleware
 * @param provider
 * @returns {Function}
 */
function authenticate(provider) {
    return async (req, res, next) => {
        try {
            let user = await provider.findOne({username: req.body.username})
            if (!user) return res.status(401).json({message: 'bad credential'})
            if (await comparePassword(req.body.password, user.password)) {
                // here we generate json web token
                // but will return ok For now
                return res.status(200).json({token: generateToken(user)})
            } else {
                return res.status(403).json({message: 'bad credential'})
            }
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }
}

/**
 *
 * @param provider
 * @param securityProvider
 * @returns {Function}
 */
function authorize(provider, securityProvider) {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token === null) return res.sendStatus(403)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) return res.sendStatus(403)
            if(typeof securityProvider === 'function'){
                securityProvider(provider,user, next);
            } else {
                req.user = user;
                next();
            }
        })
    }
}

module.exports = {
    authenticate: authenticate,
    authorize: authorize,
    hashPassword: hashPassword,
    comparePassword: comparePassword
}
