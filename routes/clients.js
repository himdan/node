const express = require('express')
const router = express.Router();
const Client = require('../models/client')
const paginator = require('../middleware/pagination')
//Get all
router.get('/', paginator(Client), async (req, res) => {
    res.status(200).json(res.paginatedResults)
})
// get one client
router.get('/:id', getClient  ,async (req, res) => {
   await  res.json(res.client)
})

// create one client

router.post('/', async (req, res) => {
    const client = new Client({
        ip: req.connection.remoteAddress,
    })
    try {
        const clientNew = await client.save();
        res.status(201).json(clientNew)
    } catch (e) {
        res.status(400).json({message: e.message})
    }
})

// update one client


router.patch('/:id', getClient, async (req, res) => {
    if(req.body.ip){
        res.client.ip = req.body.ip
    }
    try{
        let updatedClient = await res.client.save()
        res.status(201).json(updatedClient);
    }catch (e) {
        res.status(400).json({message:e.message})
    }
})
router.delete('/:id', getClient, async (req, res) => {
    try{
        await res.client.remove();
        await res.json({message:'client deleted with success'})
    } catch (e) {
        res.status(500).json({message:e.message})
    }
})

// midleware


async function getClient(req, res, next) {
    let client
    try {
        client = await Client.findById(req.params.id)
        if (client === null) {
            return res.status(404).json({message: 'unable to find the requested client'})
        }
    } catch (e) {
        return res.status(500).json({message: e.message})
    }
    res.client = client
    next()
}

module.exports = router;
