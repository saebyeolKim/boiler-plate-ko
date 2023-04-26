const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;                              //salt를 만들때 10자리 salt를 만든다. 
const jwt = require('jsonwebtoken');

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
        minlength: 5
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
    } else {
        next()
    }
})

//비밀번호를 비교한다.
userSchema.methods.comparePassword = function(plainPassword, cb) {
    var user = this
    //plainPassword 123456      암호화된 비밀번호 $2b$10$K2J1FPfEkHjCz2xb6RT27erIkCys6UPUf9CGPbauJt5mQty7dKRnK
    bcrypt.compare(plainPassword, user.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    //jwonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken') //mongodb 에서 생성된 id (user._id)는 string이 아니므로, mongoDB의 toHexString() 메서드를 사용하여 다음과 같이 형변환을 해주어야 한다.

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user);
    })
}

userSchema.statics.findByToken = function( token, cb ) {
    var user = this;

    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인한다.
        user.findOne({"_id": decoded, "token":token }, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}
/*
메소드는 객체의 인스턴스를 만들어야만 사용이 가능하지만 
스태틱은 객체의 인스턴스를 만들지 않아도 사용이 가능합니다. 
코드를 보시면 
const temp = new User() 이런식으로 선언하고난 뒤 
temp.(메소드) 이런식으로 호출해야만 쓸 수 있는 것이 메소드고요.
User.(스태틱) 이런식으로 호출할 수 있는 것이 스태틱입니다. 스태틱은 temp.(스태틱)을 형태로도 호출이 가능합니다. 
스태틱은 인스턴스와 무관하게 공용적으로 자주 쓰이는 함수가 필요할 때 쓰이는 것 같습니다.
*/
const User = mongoose.model('User', userSchema)

module.exports = {User}