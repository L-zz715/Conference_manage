const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/conference')

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

const adminPermisSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    children: [
        { name: { type: String } }
    ]
})

const AdminPermiss = mongoose.model('AdminPermiss', adminPermisSchema)


const chairPermisSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    children: [
        { name: { type: String } }
    ]
})

const ChairPermiss = mongoose.model('ChairPermiss', chairPermisSchema)

const authorPermisSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    children: [
        { name: { type: String } }
    ]
})

const AuthorPermiss = mongoose.model('AuthorPermiss', authorPermisSchema)

const reviewerPermisSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    children: [
        { name: { type: String } }
    ]
})

const ReviewerPermiss = mongoose.model('ReviewerPermiss', reviewerPermisSchema)

const RoleSchema = new mongoose.Schema({
    rolename: { type: String, unique: true },
    description: { type: String },
})

const Role = mongoose.model('Role', RoleSchema)

const reviewSchema = new mongoose.Schema({
    reviewTitle: { type: String },
    reviewerName: { type: String },
    content: { type: String }
}, {
    toJSON: { virtuals: true }  //就可以用json格式取出
})

reviewSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'reviewList',
    justOne: false  //表示返回的不是一条，是个数组
})

const Review = mongoose.model('Review', reviewSchema)


const paperSchema = new mongoose.Schema({
    title: { type: String },
    authorName: { type: String },
    topic: { type: String },
    content: { type: String },
    hasReviewed: { type: Boolean },
    reviewList: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Review' }]
}, {
    toJSON: { virtuals: true }  //就可以用json格式取出
})

paperSchema.virtual('papers', {
    ref: 'Paper',
    localField: '_id',
    foreignField: 'paperList',
    justOne: false  //表示返回的不是一条，是个数组
})

const Paper = mongoose.model('Paper', paperSchema)

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


