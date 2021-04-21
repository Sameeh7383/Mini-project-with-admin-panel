var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var { ObjectId, ObjectID } = require("mongodb");
var url = "mongodb://localhost:27017";
var email = "sameeh987@gmail.com";
var password = 123;

// TO ADMIN LOGIN

router.get("/", function (req, res) {
  if (req.session.aloggedin) {
    res.redirect("/admin/table");
  } else {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.render("adminlogin", { alogginerr: req.session.alogginerr });
    req.session.alogginerr = false;
  }
});
router.get("/adduserform", function (req, res) {
  if (req.session.aloggedin) {
    res.render("adduserform",{"signuperr1":req.session.signuperr1});
    req.session.signuperr1=false
  } else {
    res.redirect("/admin");
  }
});
router.post("/adduser", function (req, res) {
  if (req.session.aloggedin) {
    MongoClient.connect(url, async function (err, client) {
     
    var user=await client.db("persons").collection("user").findOne({email:req.body.email})
  
    if(user){
      
      req.session.signuperr1=true
      res.redirect('/admin/adduserform')}

    else{
      client.db("persons").collection("user").insertOne(req.body);
      res.redirect("/admin/table");
    };
  }
  )}
  else {
    res.redirect("/admin");
  }
});
router.post("/editsignup/:id", function (req, res) {
  if (req.session.aloggedin) {
    MongoClient.connect(url, function (err, client) {
      client
        .db("persons")
        .collection("user")
        .updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body });
      if (err) console.log(err);
      res.redirect("/admin/table");
    });
  } else {
    res.redirect("/admin");
  }
});

router.get("/table", function (req, res) {
  if (req.session.aloggedin) {
    MongoClient.connect(url, function (err, client) {
      client
        .db("persons")
        .collection("user")
        .find({})
        .toArray(function (err, result) {
          if (err) console.log(err);
          res.header(
            "Cache-Control",
            "private, no-cache, no-store, must-revalidate"
          );

          res.render("admintable", { result: result });
        });
    });
  } else {
    res.redirect("/admin");
  }

  // res.render('admintable')
});
router.get("/delete/:id", function (req, res) {
  if (req.session.aloggedin) {
    MongoClient.connect(url, function (err, client) {
      client
        .db("persons")
        .collection("user")
        .deleteOne({ _id: ObjectId(req.params.id) });
      res.redirect("/admin/table");
    });
  } else {
    res.redirect("/admin");
  }
});
router.get("/edit/:id", function (req, res) {
  if (req.session.aloggedin) {
    // console.log("hii")
    // console.log(req.params.id)
    MongoClient.connect(url, function (err, client) {
      client
        .db("persons")
        .collection("user")
        .findOne({ _id: ObjectId(req.params.id) }, function (err, result) {
          if (err) console.log("ERROR");
          console.log(result);
          res.render("editdetails", { result });
        });
    });
  } else {
    res.redirect("/admin");
  }
});
// router.get('/table',function (req, res) {
//     MongoClient.connect(url, function (err, client) {
//       if (err) {
//         console.log("ERROR");
//       } else {
//         client.db("persons").collection("user").find({}).toArray(function (err, result) {
//           if (err) {
//             console.log('Error');
//           } else {
//             res.render('admintable', {result:result});
//           }

//         });
//       }
//     });
// })
router.post("/alogin", function (req, res) {
  dat = req.body;
  if (dat.email == email && dat.password == password) {
    req.session.aloggedin = true;
    res.redirect("/admin/table");
  } else {
    req.session.alogginerr = true;
    res.redirect("/admin");
  }
});
router.get("/logout", function (req, res) {
  req.session.aloggedin = false;
  res.redirect("/admin");
});
module.exports = router;
