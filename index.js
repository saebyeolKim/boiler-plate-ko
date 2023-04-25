const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

const config = require('./config/key')

const { User } = require("./models/User");

//application/x-www-form-urlencoded 분석해서 가져올 수 있게 해준다.
app.use(bodyParser.urlencoded({extended: true}));
//application/jason 분석해서 가져올 수 있게 해준다.
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 ~ 감사합니다 하튜')
})

app.post('/register', (req, res) => {

  //회원 가입할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  //body parser를 통해 body에 담긴 정보를 가져온다
  const user = new User(req.body)

  //mongoDB 메서드, user모델에 저장
  const result = user.save().then(()=>{
    res.status(200).json({
      success: true
    })
  }).catch((err)=>{
    res.json({ success: false, err })
  })
})

app.post('/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSucces : false, 
        message: "제공된 이메일에 해당하는 유저가없습니다."
      })
    }
  
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({ loginSucces: false, message: "비밀번호가 틀렸습니다."})

      //비밀번호까지 같다면 TOKEN을 생성한다.
      user.generateToken((err, user => {
        
      }))
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})