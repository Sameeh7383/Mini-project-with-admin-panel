var express = require('express');
var router = express.Router();
var MongoClient=require('mongodb').MongoClient
var url='mongodb://localhost:27017'

/* GET home page. */


router.post('/usrlogin',function(req,res){


MongoClient.connect(url,async function(err,client){
    var user= await client.db('persons').collection('user').findOne(req.body)
     if (user){
       req.session.loggedin=true;
       res.redirect('/home')
     }
     else{
       req.session.logginerr=true;
       res.redirect("/")
     }
    
    });})

router.get('/home',function(req,res){
  if(req.session.loggedin){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  MongoClient.connect(url,async function(err,client){
    client.db("persons").collection("products").find({}).toArray(function (err, result) {
      if (err)
          console.log(err);
      res.render('home', {result:result});
})})}
 else{
   res.redirect('/')
 }
});

router.get('/logout',function(req,res){
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  req.session.loggedin=false;
  res.redirect("/");
})

router.get('/register',function(req,res){
  console.log(req.session.signuperr)
  res.render('Register',{"sign":req.session.signuperr})
  req.session.signuperr=false

})
router.post('/signupform',function(req,res){

  MongoClient.connect(url,async function(err,client){
    var databs=client.db("persons").collection("user")
    var user=await databs.findOne({email:req.body.email})
  
    if(user){
      
      req.session.signuperr=true
      res.redirect('/register')
    }
    else{
   
    console.log(req.body)
      databs.insertOne(req.body)
      res.redirect('/')}
      
     
  
  

})})
router.get('/', function(req, res, next) {
  if(req.session.loggedin){
    res.redirect("/home")
  }
  else{
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      console.log(req.session.logginerr)
      res.render('index', {logginerr:req.session.logginerr});
      req.session.logginerr=false
    }
      

});
  

module.exports = router;
