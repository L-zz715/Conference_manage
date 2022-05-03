const { User, Role, AdminPermiss, ChairPermiss, AuthorPermiss, ReviewerPermiss } = require('./models/models')

const express = require('express')
//导入生成token用的包
const jwt = require('jsonwebtoken')
const keythereum = require("keythereum")
const url = require('url')

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




app.get('/api', (req, res) => {
    res.send('ok')
})

app.get('/api/users', async (req, res) => {
    const users = await User.find()
    let meta={
        status:403,
        message:'获取用户信息失败'
    }
    if(!users){
        res.send({
            meta:meta
        })
    }
    meta={
        status:200,
        message:'获取用户信息成功'
    }
    res.send({
        meta:meta,
        data:user
    })
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
    const meta = {
        status: 200,
        message: '获得用户信息成功'
    }
    res.send({
        data: req.user,
        meta: meta,

    })
})

//获取admin权限
app.get('/api/adminPermis', async (req, res) => {
    const adminPermisList = await AdminPermiss.find()
    let meta = {
        status: 403,
        message: '获取权限失败'
    }

    if(!adminPermisList){
        return res.send({
            meta:meta
        })
    }

    meta = {
        status: 200,
        message: '获取权限成功'
    }

    res.send({
        meta:meta,
        data:adminPermisList
    })
})

//给admin添加权限
app.post('/api/adminPermis', async (req,res)=>{

    const hasAdminPermis = await AdminPermiss.findOne({
        name: req.body.name
    })

    let meta = {
        status: 403,
        message: '权限已存在'
    }

    if (hasAdminPermis) {
        return res.send({
            meta: meta
        })
    }

    meta = {
        status: 200,
        message: '创建权限成功'
    }

    const adminPermis = await AdminPermiss.create({
        name:req.body.name,
        children:req.body.children
    })
    res.send({
        meta:meta,
        data:adminPermis
    })
})

//获取chair权限
app.get('/api/chairPermiss', async (req, res) => {
    const chairPermisList = await ChairPermiss.find()
    let meta = {
        status: 403,
        message: '获取权限失败'
    }

    if(!chairPermisList){
        return res.send({
            meta:meta
        })
    }

    meta = {
        status: 200,
        message: '获取权限成功'
    }

    res.send({
        meta:meta,
        data:chairPermisList
    })
})

//给chair添加权限
app.post('/api/chairPermiss', async (req,res)=>{

    const hasChairPermis = await ChairPermiss.findOne({
        name: req.body.name
    })

    let meta = {
        status: 403,
        message: '权限已存在'
    }

    if (hasChairPermis) {
        return res.send({
            meta: meta
        })
    }

    meta = {
        status: 200,
        message: '创建权限成功'
    }

    const chairPermis = await ChairPermiss.create({
        name:req.body.name,
        children:req.body.children
    })
    res.send({
        meta:meta,
        data:chairPermis
    })
})

//获取author权限
app.get('/api/authorPermiss', async (req, res) => {
    const authorPermisList = await AuthorPermiss.find()
    let meta = {
        status: 403,
        message: '获取权限失败'
    }

    if(!authorPermisList){
        return res.send({
            meta:meta
        })
    }

    meta = {
        status: 200,
        message: '获取权限成功'
    }

    res.send({
        meta:meta,
        data:authorPermisList
    })
})

//给author添加权限
app.post('/api/authorPermiss', async (req,res)=>{

    const hasAuthorPermis = await AuthorPermiss.findOne({
        name: req.body.name
    })

    let meta = {
        status: 403,
        message: '权限已存在'
    }

    if (hasAuthorPermis) {
        return res.send({
            meta: meta
        })
    }

    meta = {
        status: 200,
        message: '创建权限成功'
    }

    const authorPermis = await AuthorPermiss.create({
        name:req.body.name,
        children:req.body.children
    })
    res.send({
        meta:meta,
        data:authorPermis
    })
})

//获取reviewer权限
app.get('/api/reviewerPermiss', async (req, res) => {
    const reviewerPermisList = await ReviewerPermiss.find()
    let meta = {
        status: 403,
        message: '获取权限失败'
    }

    if(!reviewerPermisList){
        return res.send({
            meta:meta
        })
    }

    meta = {
        status: 200,
        message: '获取权限成功'
    }

    res.send({
        meta:meta,
        data:reviewerPermisList
    })
})

//给reviewer添加权限
app.post('/api/reviewerPermiss', async (req,res)=>{

    const hasReviewerPermis = await ReviewerPermiss.findOne({
        name: req.body.name
    })

    let meta = {
        status: 403,
        message: '权限已存在'
    }

    if (hasReviewerPermis) {
        return res.send({
            meta: meta
        })
    }

    meta = {
        status: 200,
        message: '创建权限成功'
    }

    const reviewerPermis = await ReviewerPermiss.create({
        name:req.body.name,
        children:req.body.children
    })
    res.send({
        meta:meta,
        data:reviewerPermis
    })
})

app.get('/api/permission', async (req,res)=>{
    //解析url 获得传参role的值
    const role = url.parse(req.url,true).query.role
    const meta1 = {
        status: 403,
        message: '获取权限失败'
    }
    const meta2 = {
        status: 200,
        message: '创建权限成功'
    }

    if(role === 'admin'){
        const adminPermisList = await AdminPermiss.find()
        if(!adminPermisList){
            res.send({meta:meta1})
        }
        res.send({
            meta:meta2,
            data:adminPermisList
        })

    }else if(role === 'chair'){
        const chairPermisList = await ChairPermiss.find()
        if(!chairPermisList){
            res.send({meta:meta1})
        }
        res.send({
            meta:meta2,
            data:chairPermisList
        })
    }else if(role === 'author'){
        const authorPermisList = await AuthorPermiss.find()
        if(!authorPermisList){
            res.send({meta:meta1})
        }
        res.send({
            meta:meta2,
            data:authorPermisList
        })
    }else if(role === 'reviewer'){
        const reviewerPermisList = await ReviewerPermiss.find()
        if(!reviewerPermisList){
            res.send({meta:meta1})
        }
        res.send({
            meta:meta2,
            data:reviewerPermisList
        })
    }else{
        res.send({
            meta:{
                status:422,
                message:'角色不存在'
            }
        })
    }


})

app.get('/api/roles', async (req, res)=>{
    const roles = await Role.find()

    let meta={
        status:403,
        message:'获取角色信息失败'
    }
    if(!roles){
        res.send({
            meta:meta
        })
    }
    meta={
        status:200,
        message:'获取角色信息成功'
    }
    res.send({
        meta:meta,
        data:roles
    })
})

app.post('/api/roles', async (req, res)=>{
    const hasRole = await Role.findOne({
        rolename:req.body.rolename
    })
    
    let meta = {
        status: 403,
        message: '角色已存在'
    }

    if(hasRole){
        res.send({
            meta:meta,
        })
    }

    meta = {
        status: 200,
        message: '创建角色成功'
    }

    const role = await Role.create({
        rolename: req.body.rolename,
        description: req.body.description
    })
    res.send(role)
})

app.listen(4000, (err) => {
    if (!err) {
        console.log('服务器启动了 http://localhost:4000')
    }
})