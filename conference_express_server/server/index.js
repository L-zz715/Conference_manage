const express = require('express')

const app = express()

app.use(require('cors')())
app.use(express.json())

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/element-admin', {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true
})

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: {type: String},
    mobile: {type: String},
    role_names: {type: Array},
    interest_area: {type: String}

}))

app.get('/', async (req, res) => {
    res.send('ok')
})

app.post('/api/users', async (req, res) => {
    const user = await User.create(req.body)
    res.send(user)
})

app.listen(3001, () => {
    console.log('服务器启动了, http://localhost:3001')
})