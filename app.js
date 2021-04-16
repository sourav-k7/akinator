const express = require('express')
const { Aki } = require('aki-api');
const path = require('path');
const ejs =require('ejs');
const engine = require('ejs-mate');
var cookieParser = require('cookie-parser')
const { v4: uuid } = require('uuid');
const region = 'en';
const app = express()
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

var userlist=[];
app.get('/',(req,res)=>{
  userlist = userlist.filter((u)=>{
      if((Date.now()-u.ctime)<3600000){
        return true;
      }
      else{
        return false;
      }
  })
  res.render('index');
})
app.get('/start',async (req,res)=>{
  const childMode=true;
  const user = {userid:uuid(),data:new Aki(region,childMode),ctime:Date.now()};
  userlist.push(user);
  
  res.cookie('uid',user.userid);
   await user.data.start();
    const question = user.data.question;
    res.render('game',{question});
})
app.post('/ans',async (req,res)=>{
 const uid =req.cookies.uid;
 const user=userlist.find((u)=>u.userid==uid)
 await user.data.step(req.body.answer);
  const question =user.data.question;
  if(user.data.progress>=90)
  {
   await user.data.win();
      const guess = user.data.answers[0];
     userlist= userlist.filter((u)=>u!=user);
      return  res.render('win',{guess});
    }
 return res.render('game',{question});
})
const port = process.env.PORT||3000
app.listen(port, () => console.log(`listening on port ${port}`))