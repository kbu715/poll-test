const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));
// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://tiger:1234@cluster0-cgecu.mongodb.net/test?retryWrites=true&w=majority");
var db = mongoose.connection;
db.once('open', function () {
  console.log('DB connected');
});
db.on('error', function (err) {
  console.log('DB ERROR : ', err);
});


const pollSchema = mongoose.Schema({
    gender: { type: String },
    animal: { type: String },
  }
  );
const Poll = mongoose.model('poll',pollSchema)



app.get('/', function (req, res) {
    res.render('new')
  });
  
 
  app.get('/pollAction', async function (req, res) {
    let result = [
      await Poll.countDocuments({ gender: '남' ,animal:'호랑이'}),
      await Poll.countDocuments({ gender: '남' ,animal:'코끼리'}),
      await Poll.countDocuments({ gender: '여' ,animal:'호랑이'}),
      await Poll.countDocuments({ gender: '여' ,animal:'코끼리'}),
    ]
    res.render('index',{data:result})
    
  }),

  
  // Contacts - create
  app.post('/pollAction', function (req, res) {
    Poll.create(req.body, function (err) {
      if (err) return res.json(err);
      res.redirect('/pollAction');
    });
  });
  
  // Port setting
  var port = 3000;
  app.listen(port, function () {
    console.log('server on! http://localhost:' + port);
  });