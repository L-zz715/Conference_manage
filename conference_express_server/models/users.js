const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/conference')

const UserSchema = new mongoose.Schema({
    username:{type:String,unique:true},
    email:{type:String},
    password:{type:String},
    mobile:{type:String},
    rolelist:[{type:String}],
    interest:{type:String}
})

const User = mongoose.model('User', UserSchema)

module.exports = {User}


