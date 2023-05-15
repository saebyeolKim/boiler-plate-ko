const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth')
const { User } = require("./models/User");
const mysql = require('mysql');
const db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'giupin'
})

db.connect();

//application/x-www-form-urlencoded 분석해서 가져올 수 있게 해준다.
app.use(bodyParser.urlencoded({extended: true}));
//application/jason 분석해서 가져올 수 있게 해준다.
app.use(bodyParser.json());
//cookie에 있는 내용을 읽고 저장할 수 있다.
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 ~ 감사합니다 하튜')
})

app.get('/api/hello', (req, res) => {
  res.send('안녕하세요');
})

app.post('/api/users/register', (req, res) => {

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

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess : false, 
        message: "제공된 이메일에 해당하는 유저가없습니다."
      })
    }
  
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      //비밀번호까지 같다면 TOKEN을 생성한다.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        //토큰을 저장한다. 어디에 ? 쿠키, 로컬스토리지
        //쿠키에 저장한다.
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

app.get('/api/users/auth', auth,(req, res) => {
  //여기까지 미들웨를 통과해 왔다는 얘기는 Authentication이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, //role 0이 아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image 
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id},
    {token: ""}
    , (err, user) => {
      if (err) return res.json({ success : false, err});
      return res.status(200).send({
        success: true
      })
    }
  )
})

app.get('/api/test', (req, res) => {
  db.query('SELECT * FROM USER', function(err, results){
    console.log(results);
    res.end('Success');
  })
})

const port = 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})