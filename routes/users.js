const express = require('express')
const router = express.Router();
const User = require('../models/user')
const paginator = require('../middleware/pagination')
const guard = require('../middleware/guard');
//Get all
router.get('/', guard.authorize(User), paginator(User), async (req, res) => {
    res.status(200).json(res.paginatedResults)
})

router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: await guard.hashPassword(req.body.password)
    })
    try {
        const userNew = await user.save();
        res.status(201).json(userNew)
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})
router.post('/login', guard.authenticate(User), async (req, res) => {
    res.status(200).json(req.user);

})
module.exports = router;
