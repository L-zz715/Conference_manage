const { User } = require('./models/users')

const express = require('express')

const app = express()

app.use(require('cors')())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('ok')
})

app.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

app.post('/api/register', async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile,
        rolelist: req.body.rolelist,
        interest: req.body.interest,

    })
    res.send(user)
})

app.listen(4000, (err) => {
    if (!err) {
        console.log('服务器启动了 http://localhost:4000')
    }
})