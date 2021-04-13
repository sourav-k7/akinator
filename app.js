const express = require('express')
const { Aki } = require('aki-api');
const path = require('path');
const ejs =require('ejs');
const engine = require('ejs-mate');
const region = 'en';
let aki ;
const app = express()
app.use(express.urlencoded({extended:true}));
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.get('/home',(req,res)=>{
  res.render('index');
})
app.get('/start',async (req,res)=>{
  aki= new Aki(region);
  await aki.start()
    var question = aki.question;
    res.render('game',{question});
})
app.post('/ans',async (req,res)=>{
  
  await aki.step(req.body.answer);
  const question =aki.question;
  if(aki.progress>=90)
  {
     await aki.win();
     const guess = aki.answers[0];
   return  res.render('win',{guess});
  }
 return res.render('game',{question});
})
const port = process.env.PORT||3000
app.listen(port, () => console.log(`listening on port ${port}`))