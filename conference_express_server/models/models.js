const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/conference')

// 创建用户模型
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: {
        type: String,
        set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
    mobile: { type: String },
    rolelist: [{ type: String }],
    interest: { type: String }
})

const User = mongoose.model('User', UserSchema)

// 创建admin权限模型
const adminPermisSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    children: [
        { name: { type: String } }
    ]
})

const AdminPermiss = mongoose.model('AdminPermiss', adminPermisSchema)

// 创建chair权限模型
const chairPermisSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    children: [
        { name: { type: String } }
    ]
})

const ChairPermiss = mongoose.model('ChairPermiss', chairPermisSchema)

// 创建author权限模型
const authorPermisSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    children: [
        { name: { type: String } }
    ]
})

const AuthorPermiss = mongoose.model('AuthorPermiss', authorPermisSchema)

// 创建reviewer权限模型
const reviewerPermisSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    children: [
        { name: { type: String } }
    ]
})

const ReviewerPermiss = mongoose.model('ReviewerPermiss', reviewerPermisSchema)

// 创建角色模型
const RoleSchema = new mongoose.Schema({
    rolename: { type: String, unique: true },
    description: { type: String },
})

const Role = mongoose.model('Role', RoleSchema)

// 创建评论review模型并和文章paper模型关联
const reviewSchema = new mongoose.Schema({
    reviewTitle: { type: String },
    reviewerName: { type: String },
    content: { type: String }
}, {
    toJSON: { virtuals: true }  //就可以用json格式取出
})

reviewSchema.virtual('papers', {
    ref: 'Paper',
    localField: '_id',
    foreignField: 'reviewList',
    justOne: false  //表示返回的不是一条，是个数组
})

const Review = mongoose.model('Review', reviewSchema)

// 创建文章paper模型并和会议conference模型关联
const paperSchema = new mongoose.Schema({
    title: { type: String },
    authorName: { type: String },
    topic: { type: String },
    content: { type: String },
    reviewList: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Review' , maxlength: 3}]
}, {
    toJSON: { virtuals: true }  //就可以用json格式取出
})

paperSchema.virtual('conferences', {
    ref: 'Conference',
    localField: '_id',
    foreignField: 'paperList',
    justOne: false  //表示返回的不是一条，是个数组
})

const Paper = mongoose.model('Paper', paperSchema)

// 创建会议conference模型
const ConferenceSchema = new mongoose.Schema({
    confername: { type: String },
    title: { type: String },
    topic: { type: String },
    chairname: { type: String },
    date: { type: Date },
    attendPpl:[{ type: String }],
    paperList: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Paper' }]
})

const Conference = mongoose.model('Conference', ConferenceSchema)


module.exports = { User, Role, Conference, Paper, Review, AdminPermiss, ChairPermiss, AuthorPermiss, ReviewerPermiss }


