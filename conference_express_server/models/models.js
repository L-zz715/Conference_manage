const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/conference')

const UserSchema = new mongoose.Schema({
    username:{type:String,unique:true},
    email:{type:String,unique:true},
    password:{
        type:String,
        set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
    mobile:{type:String},
    rolelist:[{type:String}],
    interest:{type:String}
})

const User = mongoose.model('User', UserSchema)

// const ConferenceSchema = new mongoose.Schema({
//     confername:{},
//     title:{},
//     topic:{},
//     chairname:{},
//     date:{},
//     paperList:[{type}]
// })

module.exports = {User}


