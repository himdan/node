require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true, useUnifiedTopology: true }).catch(error => {
    console.error(error)
})
const db = mongoose.connection;

db.on('error',(error)=>console.error(error))
db.once('open', ()=>console.log('db is up'))

app.use(express.json())

const clientsRoutes = require('./routes/clients')
const usersRoutes = require('./routes/users')
app.use('/clients',clientsRoutes)
app.use('/users',usersRoutes)

app.listen(process.env.SERVER_PORT, ()=>console.log('server is running'))
