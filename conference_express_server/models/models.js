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

// const ConferenceSchema = new mongoose.Schema({
//     confername:{},
//     title:{},
//     topic:{},
//     chairname:{},
//     date:{},
//     paperList:[{type}]
// })

module.exports = { User, AdminPermiss, ChairPermiss, AuthorPermiss, ReviewerPermiss }


