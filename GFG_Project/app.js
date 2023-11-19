const exp = require('constants');
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/HealthDB');
}

// Mongoose Stuff
const loginSchema = new mongoose.Schema({
    name: String,
    password: String
});

const Login = mongoose.model('login', loginSchema);

const app = express()
const port = 80
var check;

// EXPRESS Specific STUFF
app.use('/static', express.static('static'))
app.use(express.urlencoded())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))


// ENDPOINTS
app.get("/", (req, res)=>{
    res.status(200).render('index.pug')
})

app.get('/login', (req, res)=>{
    res.status(200).render('login.pug')
})


app.post('/signup', async (req, res)=>{
    var myData = new Login(req.body);
    myData.save().then(()=>{
        res.status(200).render('after_login.pug')
    }).catch(()=>{
        res.status(404).send("This item couldnt save to database")
    })
})

app.post('/login', async (req, res)=>{
    try {
        check = await Login.findOne({name: req.body.name})
        if(check.password === req.body.password){
            console.log(check)
            res.status(200).render('after_login.pug', check)
        }
        else{
            res.status(404).send("Wrong passsword")
        }
    } 
    catch {
       res.send("Wrong details") 
    }
})

app.get('/addInfo', async (req, res)=>{
    const params = {'checkname': check.name, 'password': check.password}
    console.log(check.name)
    res.status(200).render('addInfo.pug', params)
})

// STSRT THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`)
})