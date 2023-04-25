const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;                              //salt를 만들때 10자리 salt를 만든다. 
const someOtherPlaintextPassword = 'not_bacon';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//user.save 전에 실행된다.
userSchema.pre('save', function(next){
    var user = this
    
    if(user.isModified('password')) {
    //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash //hash: 암호화 password 
                next()
            });
        });
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User}