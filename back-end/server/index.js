// server/index.js

// pour activer le MongoDB, exécuter  `mongod.exe --dbpath d:\mangoData\db -auth` dans `D:\Program Files\MongoDB\Server\6.0\bin>`

var express = require("express"); //加载express构造函数

const PORT = process.env.PORT || 3001;

var app = express(); //生成创建服务的实例
var bodyParser = require("body-parser");//获取post请求参数

// const registerRouter = express.Router();


const name = 'ghoti';
const password = 'guichijin';
const host = '127.0.0.1';
const port = '27017';
const database = 'admin';
const uri = `mongodb://${name}:${password}@${host}:${port}/?authMechanism=DEFAULT&authSource=${database}`;
// const uri = 'mongodb://ghoti:guichijin@127.0.0.1:27017/?authMechanism=DEFAULT&authSource=admin'


app.use(express.static("statics"));//指定资源路径
 
app.use(bodyParser.json());//处理以json格式的提交
app.use(bodyParser.urlencoded({//处理以form表单的提交
	extended: false
}))

// app.use((req,res,next)=>{
//   console.log("有人请求服务器")
//   next()
// })
// app.use('/register', registerRouter);



const mongoose = require('mongoose');

AddToDB().catch(err => console.log('error: ', err));

async function AddToDB(req, res){
  await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

  const ListTaches = new mongoose.Schema({
    id: Number, 
    content: String, 
    label: [String], 
    editLabel: Boolean,
    importance: Boolean,
    deadline: String,
    createTime: String,
    modifyTime: String
  });

  ListTaches.methods.speak = function speak() {
    const greeting = this.id
      ? 'content is ' + this.id + ': ' + this.content
      : 'I don\'t have a content';
    console.log(greeting);
  };

  const Tache = mongoose.model('Tache', ListTaches);
  // const tache = new Tache(req.body);
  const tache = new Tache({ 
    id: 1, 
    content: 'tache1', 
    label: ['label1', 'label2'], 
    editLabel: false,
    importance: false,
    deadline: '2022:05:12',
    createTime: new Date(),
    modifyTime: new Date(),
  });

  await tache.save();
  tache.speak();

  // res.send('Tache recorded. ');
}

app.use("/api", function(req, res){//这里res和req对象是由express封装过的了
  // AddToDB(req, res);
})



// app.post("/register", function(req, res){
// 	console.log('received message: ', req.body)//请求的参数对象
// 	res.json({//给前端返回json格式的数据
// 		code: 0,
// 		msg: "登录成功"
// 	})
// })
 

app.listen(PORT, ()=>{
	console.log("server run on port ", PORT);
})

