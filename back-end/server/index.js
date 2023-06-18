// server/index.js

// pour activer le MongoDB, exécuter  `mongod.exe --dbpath d:\mangoData\db -auth` dans `D:\Program Files\MongoDB\Server\6.0\bin>`

var express = require("express"); //Charger express

const PORT = process.env.PORT || 3001;

var app = express(); 
var bodyParser = require("body-parser");

const name = 'ghoti';
const password = 'guichijin';
const host = '127.0.0.1';
const port = '27017';
const database = 'admin';
const uri = `mongodb://${name}:${password}@${host}:${port}/?authMechanism=DEFAULT&authSource=${database}`;
// const uri = 'mongodb://ghoti:guichijin@127.0.0.1:27017/?authMechanism=DEFAULT&authSource=admin'


app.use(express.static("statics"));
app.use(bodyParser.json());// Traitement des soumissions au format json
app.use(bodyParser.urlencoded({// Traitement des soumissions de formulaires
	extended: false
}))

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

app.use("/api", function(req, res){
  AddToDB(req, res);
})
 

app.listen(PORT, ()=>{
	console.log("server run on port ", PORT);
})

