const { User } = require('./models/models')

const express = require('express')
//导入生成token用的包
const jwt = require('jsonwebtoken')
const keythereum = require("keythereum")

const app = express()

// 解决跨域
app.use(require('cors')())
// 处理json
app.use(express.json())

// const SECRET = 'FACKSECRET'

//产生密钥
// const dk = keythereum.create()
// const SECRET = dk.privateKey.toString('hex')
// console.log(SECRET)
//保存密钥
// const keyObject = keythereum.dump(Buffer.from('conference management'), dk.privateKey, dk.salt, dk.iv)
// keythereum.exportToFile(keyObject,'./private/' + "keystore/")

//从文件中获得储存的密钥
const address = ''
const keyObject = keythereum.importFromFile(address, './private/');
const privateKey = keythereum.recover('conference management', keyObject);
console.log(privateKey.toString('hex'))
const SECRET = privateKey.toString('hex')




app.get('/', (req, res) => {
    res.send('ok')
})

app.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

app.post('/api/register', async (req, res) => {
    //判断用户是否已注册
    const hasUser = await User.find().where({
        email: req.body.email
    })

    if (hasUser.length > 0) {
        return res.send({
            status: 403,
            message: '用户已存在'
        })
    }

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

app.post('/api/login', async (req, res) => {
    //判断用户是否存在
    const user = await User.findOne({
        email: req.body.email
    })

    let meta = {
        status: 422,
        message: '用户不存在'
    }

    if (!user) {
        //用户不存在提交状态码
        return res.send({
            meta: meta
        })
    }

    //判断密码是否匹配
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )

    meta = {
        status: 422,
        message: '密码无效'
    }

    if (!isPasswordValid) {
        return res.send({
            meta: meta
        })
    }

    //生成token
    const token = jwt.sign({
        id: String(user._id)
    },
        SECRET
    )

    meta = {
        status: 200,
        message: '登录成功'
    }

    res.send({
        user,
        meta: meta,
        token: token
    })
})

//验证登录中间件
const authMiddleware = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    console.log(req.headers)
    const { id } = jwt.verify(raw, SECRET)
    req.user = await User.findById(id)
    next()
}

//获得用户信息
app.get('/api/profile', authMiddleware, async (req, res) => {
    res.send(req.user)
})

app.listen(4000, (err) => {
    if (!err) {
        console.log('服务器启动了 http://localhost:4000')
    }
})