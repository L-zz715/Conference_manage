const { User, Role, Conference, Paper, Review, AdminPermiss, ChairPermiss, AuthorPermiss, ReviewerPermiss } = require('./models/models')

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

const SECRET = privateKey.toString('hex')


//验证登录中间件
const authMiddleware = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()

    const { id } = jwt.verify(raw, SECRET)
    req.user = await User.findById(id)
    next()
}

// 测试
app.get('/api', (req, res) => {
    res.send('ok')
})

// 根据query值查询user信息
app.get('/api/users', authMiddleware, async (req, res) => {
    let users = await User.find()

    const queryStr = "^.*" + req.query.query + ".*$"
    const reg = new RegExp(queryStr)

    let meta = {
        status: 403,
        message: '获取用户信息失败'
    }
    if (!users) {
        res.send({
            meta: meta
        })
    }
    meta = {
        status: 200,
        message: '获取用户信息成功'
    }
    const userNum = await User.find().where({
        username: reg
    }).count()

    users = await User.find().where({
        username: reg
    })
        .limit(req.query.pagesize).skip((req.query.pagenum - 1) * req.query.pagesize)
    res.send({
        meta: meta,
        data: users,
        total: userNum
    })



})

// 获得所有用户信息
app.get('/api/allusers', authMiddleware, async (req, res) => {
    let users = await User.find()

    if (!users) {
        res.send({
            meta: {
                status: 403,
                message: '获取用户信息失败'
            }
        })
    }
    res.send({
        meta: {
            status: 200,
            message: '获取用户信息成功'
        },
        data: users,
    })

})

// 注册用户
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
    const meta = {
        status: 200,
        message: '创建用户成功'
    }
    res.send({
        meta: meta,
        data: user
    })
})

// 登录
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

// 获得用户信息
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

// 查询用户by id
app.get('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id)

    let meta = {
        status: 403,
        message: '用户不存在'
    }
    if (!user) {
        res.send({
            meta: meta
        })
    }

    meta = {
        status: 200,
        message: '获得用户信息成功'
    }

    res.send({
        meta: meta,
        data: user
    })

})

// 修改用户
app.put('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id)

    let meta = {
        status: 403,
        message: '用户不存在'
    }
    if (!user) {
        res.send({
            meta: meta
        })
    }
    meta = {
        status: 200,
        message: '修改用户信息成功'
    }

    user.mobile = req.body.mobile
    user.rolelist = req.body.rolelist
    user.interest = req.body.interest
    await user.save()
    res.send({
        meta: meta,
        data: user
    })
})

// 删除用户
app.delete('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    const meta = {
        status: 403,
        message: '用户不存在'
    }
    if (!user) {
        res.send({
            meta: meta
        })
    }
    await user.remove();
    res.send({
        meta: {
            status: 200,
            message: '删除用户成功'
        }
    })
})

// 获取admin权限
app.get('/api/adminPermis', async (req, res) => {
    const adminPermisList = await AdminPermiss.find()
    let meta = {
        status: 403,
        message: '获取权限失败'
    }

    if (!adminPermisList) {
        return res.send({
            meta: meta
        })
    }

    meta = {
        status: 200,
        message: '获取权限成功'
    }

    res.send({
        meta: meta,
        data: adminPermisList
    })
})

// 给admin添加权限
app.post('/api/adminPermis', async (req, res) => {

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
        name: req.body.name,
        children: req.body.children
    })
    res.send({
        meta: meta,
        data: adminPermis
    })
})

// 获取chair权限
app.get('/api/chairPermiss', async (req, res) => {
    const chairPermisList = await ChairPermiss.find()
    let meta = {
        status: 403,
        message: '获取权限失败'
    }

    if (!chairPermisList) {
        return res.send({
            meta: meta
        })
    }

    meta = {
        status: 200,
        message: '获取权限成功'
    }

    res.send({
        meta: meta,
        data: chairPermisList
    })
})

// 给chair添加权限
app.post('/api/chairPermiss', async (req, res) => {

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
        name: req.body.name,
        children: req.body.children
    })
    res.send({
        meta: meta,
        data: chairPermis
    })
})

// 获取author权限
app.get('/api/authorPermiss', async (req, res) => {
    const authorPermisList = await AuthorPermiss.find()
    let meta = {
        status: 403,
        message: '获取权限失败'
    }

    if (!authorPermisList) {
        return res.send({
            meta: meta
        })
    }

    meta = {
        status: 200,
        message: '获取权限成功'
    }

    res.send({
        meta: meta,
        data: authorPermisList
    })
})

// 给author添加权限
app.post('/api/authorPermiss', async (req, res) => {

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
        name: req.body.name,
        children: req.body.children
    })
    res.send({
        meta: meta,
        data: authorPermis
    })
})

// 获取reviewer权限
app.get('/api/reviewerPermiss', async (req, res) => {
    const reviewerPermisList = await ReviewerPermiss.find()
    let meta = {
        status: 403,
        message: '获取权限失败'
    }

    if (!reviewerPermisList) {
        return res.send({
            meta: meta
        })
    }

    meta = {
        status: 200,
        message: '获取权限成功'
    }

    res.send({
        meta: meta,
        data: reviewerPermisList
    })
})

// 给reviewer添加权限
app.post('/api/reviewerPermiss', async (req, res) => {

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
        name: req.body.name,
        children: req.body.children
    })
    res.send({
        meta: meta,
        data: reviewerPermis
    })
})

// 根据参数判断返回的权限
app.get('/api/permission', async (req, res) => {
    //解析url 获得传参role的值
    const role = url.parse(req.url, true).query.role
    const meta1 = {
        status: 403,
        message: '获取权限失败'
    }
    const meta2 = {
        status: 200,
        message: '创建权限成功'
    }

    if (role === 'admin') {
        const adminPermisList = await AdminPermiss.find()
        if (!adminPermisList) {
            res.send({ meta: meta1 })
        }
        res.send({
            meta: meta2,
            data: adminPermisList
        })

    } else if (role === 'chair') {
        const chairPermisList = await ChairPermiss.find()
        if (!chairPermisList) {
            res.send({ meta: meta1 })
        }
        res.send({
            meta: meta2,
            data: chairPermisList
        })
    } else if (role === 'author') {
        const authorPermisList = await AuthorPermiss.find()
        if (!authorPermisList) {
            res.send({ meta: meta1 })
        }
        res.send({
            meta: meta2,
            data: authorPermisList
        })
    } else if (role === 'reviewer') {
        const reviewerPermisList = await ReviewerPermiss.find()
        if (!reviewerPermisList) {
            res.send({ meta: meta1 })
        }
        res.send({
            meta: meta2,
            data: reviewerPermisList
        })
    } else {
        res.send({
            meta: {
                status: 422,
                message: '角色不存在'
            }
        })
    }


})

// 获取角色列表
app.get('/api/roles', async (req, res) => {
    const roles = await Role.find()

    let meta = {
        status: 403,
        message: '获取角色信息失败'
    }
    if (!roles) {
        res.send({
            meta: meta
        })
    }
    meta = {
        status: 200,
        message: '获取角色信息成功'
    }
    res.send({
        meta: meta,
        data: roles
    })
})

// 添加角色
app.post('/api/roles', async (req, res) => {
    const hasRole = await Role.findOne({
        rolename: req.body.rolename
    })

    let meta = {
        status: 403,
        message: '角色已存在'
    }

    if (hasRole) {
        return res.send({
            meta: meta,
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
    res.send({
        meta: meta,
        data: role
    })
})

// 获取会议列表
app.get('/api/conference', authMiddleware, async (req, res) => {
    let conferences = await Conference.find()

    let meta = {
        status: 403,
        message: '获取会议信息失败'
    }
    if (!conferences) {
        res.send({
            meta: meta
        })
    }
    const queryStr = "^.*" + req.query.query + ".*$"
    const reg = new RegExp(queryStr)

    const conferNum = await Conference.find().where({
        confername: reg
    }).count()

    conferences = await Conference.find().where({
        confername: reg
    })
        .limit(req.query.pagesize).skip((req.query.pagenum - 1) * req.query.pagesize)


    meta = {
        status: 200,
        message: '获取会议信息成功'
    }

    res.send({
        meta: meta,
        data: conferences,
        total: conferNum
    })
})

// 获取会议列表 是否参会者 根据参会者名字判断，传参用来判断返回分页和search
app.get('/api/conference/:name', authMiddleware, async (req, res) => {
    let conferences = await Conference.find({ $or: [{ chairname: req.params.name }, { attendPpl: { $elemMatch: { $eq: req.params.name } } }] })
    let meta = {
        status: 403,
        message: '获取会议信息失败'
    }
    if (!conferences) {
        return res.send({
            meta: meta
        })
    }

    const queryStr = "^.*" + req.query.query + ".*$"
    const reg = new RegExp(queryStr)

    const conferNum = await Conference.find({ $or: [{ chairname: req.params.name }, { attendPpl: { $elemMatch: { $eq: req.params.name } } }] }).where({
        confername: reg
    }).count()

    conferences = await Conference.find({ $or: [{ chairname: req.params.name }, { attendPpl: { $elemMatch: { $eq: req.params.name } } }] }).where({
        confername: reg
    })
        .limit(req.query.pagesize).skip((req.query.pagenum - 1) * req.query.pagesize)

    meta = {
        status: 200,
        message: '获取会议信息成功'
    }
    res.send({
        meta: meta,
        data: conferences,
        total: conferNum
    })
})

// 获取会议信息只根据参会者姓名
app.get('/api/conferences/:name', authMiddleware, async (req, res) => {
    let conferences = await Conference.find({ $or: [{ chairname: req.params.name }, { attendPpl: { $elemMatch: { $eq: req.params.name } } }] })

    if (!conferences) {
        return res.send({
            meta: {
                status: 403,
                message: '获取会议信息失败'
            }
        })
    }

    res.send({
        meta: {
            status: 200,
            message: '获取会议信息成功'
        },
        data: conferences
    })
})


// 添加会议
app.post('/api/conference', async (req, res) => {

    // 解决时差问题
    const date = new Date(req.body.date)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    // 判断是否主席在同个时间创建的会议
    const hasConference = await Conference.findOne({ $and: [{ chairname: req.body.chairname }, { date: date }] })
    if (hasConference) {
        return res.send({
            meta: {
                status: 403,
                message: '会议时间冲突，请在其他时间创建会议'
            }
        })
    }

    const conference = await Conference.create({
        confername: req.body.confername,
        title: req.body.title,
        topic: req.body.topic,
        chairname: req.body.chairname,
        date: date,
        attendPpl: req.body.attendPpl
    })
    res.send({
        meta: {
            status: 200,
            message: '创建会议成功'
        },
        data: conference
    })
})

// 修改会议
app.put('/api/conference/:id', async (req, res) => {
    const conference = await Conference.findById(req.params.id)
    if (!conference) {
        res.send({
            meta: {
                status: 403,
                message: '会议不存在'
            }
        })
    }

    // console.log(date)
    // 解决时差问题
    const date = new Date(req.body.date)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    // console.log(date)

    const hasConference = await Conference.findOne({ $and: [{ chairname: conference.chairname }, { date: date }] })
    if (hasConference) {
        return res.send({
            meta: {
                status: 403,
                message: '会议时间冲突，请修改会议时间'
            }
        })
    }
    conference.confername = req.body.confername,
        conference.title = req.body.title,
        conference.topic = req.body.topic,
        conference.date = date,
        conference.attendPpl = req.body.attendPpl
    await conference.save()
    res.send({
        meta: {
            status: 200,
            message: '修改会议信息成功'
        },
        data: conference
    })
})


// 查询会议by id
app.get('/api/aconference/:id', async (req, res) => {
    const conference = await Conference.findById(req.params.id)

    let meta = {
        status: 403,
        message: '会议不存在'
    }
    if (!conference) {
        res.send({
            meta: meta
        })
    }

    meta = {
        status: 200,
        message: '获得会议信息成功'
    }

    res.send({
        meta: meta,
        data: conference
    })

})

// 删除会议
app.delete('/api/conference/:id', async (req, res) => {
    const conference = await Conference.findById(req.params.id);
    const meta = {
        status: 403,
        message: '会议不存在'
    }
    if (!conference) {
        res.send({
            meta: meta
        })
    }
    await conference.remove();
    res.send({
        meta: {
            status: 200,
            message: '删除会议成功'
        }
    })
})

// 获取所有文章
app.get('/api/allpaper', async (req, res) => {
    const paper = await Paper.find().populate('conferences')
    if (!paper) {
        return res.send({
            meta: {
                status: 403,
                message: '获取文章列表失败'
            }
        })
    }
    res.send({
        meta: {
            status: 200,
            message: '获取文章列表成功'
        },
        data: paper
    })
})

// 根据作者名(用户)，query获取文章列表
app.get('/api/papers/:userName', authMiddleware, async (req,res) =>{
    let papers = await Paper.find().where({authorName: req.params.userName}).populate('conferences')
    if (!papers) {
        return res.send({
            meta: {
                status: 403,
                message: '获取文章信息失败'
            }
        })
    }
    const queryStr = "^.*" + req.query.query + ".*$"
    const reg = new RegExp(queryStr)

    const paperNum = await Paper.find({authorName: req.params.userName}).where({
        papername: reg
    }).count()

    papers = await Paper.find({authorName: req.params.userName}).where({
        title: reg
    }).populate('conferences')
        .limit(req.query.pagesize)
        .skip((req.query.pagenum - 1) * req.query.pagesize)

    console.log(papers)
    res.send({
        meta: {
            status: 200,
            message: '获取文章信息成功'
        },
        data: papers,
        total: paperNum
    })
})

// 根据会议名，query获取文章列表
app.get('/api/papers/:conferName', authMiddleware, async (req,res) =>{
    let papers = await Paper.find().where({conferences: {confername:req.params.conferName}}).populate('conferences')
    if (!papers) {
        return res.send({
            meta: {
                status: 403,
                message: '获取文章信息失败'
            }
        })
    }
    const queryStr = "^.*" + req.query.query + ".*$"
    const reg = new RegExp(queryStr)

    const paperNum = await Paper.find({conferences: {confername:req.params.conferName}}).where({
        papername: reg
    }).count()

    papers = await Paper.find({conferences: {confername:req.params.conferName}}).where({
        title: reg
    }).populate('conferences')
        .limit(req.query.pagesize)
        .skip((req.query.pagenum - 1) * req.query.pagesize)

    console.log(papers)
    res.send({
        meta: {
            status: 200,
            message: '获取文章信息成功'
        },
        data: papers,
        total: paperNum
    })
})

// 根据query获取所有文章
app.get('/api/paper', authMiddleware, async (req, res) => {
    let papers = await Paper.find().populate('conferences')

    let meta = {
        status: 403,
        message: '获取文章信息失败'
    }
    if (!papers) {
        return res.send({
            meta: meta
        })
    }
    const queryStr = "^.*" + req.query.query + ".*$"
    const reg = new RegExp(queryStr)

    const paperNum = await Paper.find().where({
        papername: reg
    }).populate('conferences').count()

    papers = await Paper.find().where({
        title: reg
    }).populate('conferences')
        .limit(req.query.pagesize)
        .skip((req.query.pagenum - 1) * req.query.pagesize)


    meta = {
        status: 200,
        message: '获取文章信息成功'
    }
    console.log(papers)
    res.send({
        meta: meta,
        data: papers,
        total: paperNum
    })
})

// 根据id获得文章
app.get('/api/paper/:id', async (req, res) => {
    console.log(req.params)
    let paper = await Paper.findById(req.params.id)
    console.log(paper)
    if(!paper){
        return res.send({
            meta:{
                status:403,
                message:'文章不存在'
            }
        })
    }

    res.send({
        meta:{
            status:200,
            message:'获取文章成功'
        },
        data:paper
    })
})

// 修改文章
app.put('/api/paper/:paperId', async(req,res)=>{
    let paper = await Paper.findById(req.params.paperId)
    if(!paper){
        return res.send({
            meta:{
                status:403,
                message:'文章不存在'
            }
        })
    }

    paper.title = req.body.title
    paper.topic = req.body.topic
    await paper.save()
    
    res.send({
        meta:{
            status:200,
            message:'修改文章成功'
        },
        data:paper
    })
})

// 添加文章
app.post('/api/paper/:conferId', async (req, res) => {

    const hasPaper = await Paper.findOne({ $and: [{ title: req.body.title }, { authorName: req.body.authorName }] })
    if (hasPaper) {
        return res.send({
            meta: {
                status: 403,
                message: '已上传过该文章，请重新上传'
            }
        })
    }
    // console.log(req.body)
    // console.log(req.query)
    // console.log(req.params)
    const paper = await Paper.create({
        title: req.body.title,
        authorName: req.body.authorName,
        topic: req.body.topic,
        content: req.body.content,
    })

    const conference = await Conference.findById(req.params.conferId)
    conference.paperList.push(paper)
    await conference.save()
    const paperSend = await Paper.findOne({ $and: [{ title: req.body.title }, { authorName: req.body.authorName }] }).populate('conferences')
    res.send({
        meta: {
            status: 200,
            message: '添加文章成功'
        },
        data: paperSend
    })
})

// 删除文章
app.delete('/api/apaper/:id',async(req,res)=>{
    const paper = await Paper.findById(req.params.id).populate('conferences');
    const meta = {
        status: 403,
        message: '文章不存在'
    }
    if (!paper) {
        return res.send({
            meta: meta
        })
    }

    // 获得含有此文章的会议
    const conference = await Conference.findOne().where({paperList:{ $elemMatch: { $eq: paper._id } }})
    // 会议删除此文章
    let index = conference.paperList.indexOf(paper._id)
    conference.paperList.splice(index,1)
    await conference.save()
    // 在paper 数据库删除文章
    await paper.remove();
    res.send({
        meta: {
            status: 200,
            message: '删除文章成功'
        }
    })
})


// 监听4000端口
app.listen(4000, (err) => {
    if (!err) {
        console.log('服务器启动了 http://localhost:4000')
    }
})