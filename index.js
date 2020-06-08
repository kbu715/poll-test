const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
app.set('view engine', 'ejs')
mongoose.connect('mongodb+srv://tiger:1234@cluster0-cgecu.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true},
function(err){
    if(err){
        console.log(err)
    } else{
        console.log('connected')
    }

})

const pollEx = new mongoose.Schema({
    gender:String,
    animal:String,
})
const poll = mongoose.model('poll',pollEx)



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('public'))
app.get('/', (req,res)=>{
    res.sendFile('index.html')
})

app.get('/pollAction', (req,res)=>{
    console.log(req.query)
    const pollModel = new poll()
    pollModel.gender = req.query.gender;
    pollModel.animal = req.query.animal;
    pollModel.save()
    .then(()=>{
        console.log("완료")
        let arr = []
        poll.countDocuments({gender:"남", animal:"호랑이"}, (err,c)=>{
            arr.push(c);
            poll.countDocuments({gender:"남", animal:"코끼리"}, (err,c)=>{
                arr.push(c);
                poll.countDocuments({gender:"여", animal:"호랑이"}, (err,c)=>{
                    arr.push(c);
                    poll.countDocuments({gender:"여", animal:"코끼리"}, (err,c)=>{
                        arr.push(c);
                        res.render('index',{data:arr})
                    })
                })        
            })
        })
        
    })
    .catch(err =>{
        if(err){
            res.send(err)
        }
        })    
})

app.listen(3000)