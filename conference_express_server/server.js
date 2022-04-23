const express = require('express')

const app = express()

app.get('/', async(req,res) =>{
    res.send('ok')
})

app.post('/api/register', async(req,res)=>{
    res.send('register')
})

app.listen(3001, ()=>{
    console.log('服务器启动了, http://localhost:3001')
})