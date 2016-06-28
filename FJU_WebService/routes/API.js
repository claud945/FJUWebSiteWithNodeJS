var express = require('express');
var mysql = require('mysql');
var Page_Control = require('../controllers/Controller_Page.js');
var router = express.Router();
var jwt = require('jsonwebtoken');
var app =express();
var config = require('../config'); // get our config file
var User   = require('../models/users'); // get our mongoose model

var request = require("request"); 
var cheerio = require("cheerio");

var dictionary={};

app.set('superSecret', config.secret); // secret variable

router.get('/crawSomething/',function(req,res,next){

  request({
    url: "https://blog.allenchou.cc/node-js-web-spider/",
    method: "GET"
  }, function(e,r,b) {

    if(!e) {console.log(b);
     var $ = cheerio.load(b);
    var result = [];
    var titles = $("li.item h2");
    for(var i=0;i<titles.length;i++) {
      result.push($(titles[i]).text());
    }
    console.log($("head title").children());}
  });});





router.get('/list/',function(req,res,next){
		Page_Control.list(function(data){
			res.json(data);
		});

})



router.get('/GetPage/',function(req,res,next){
		Page_Control.readPage(function(data){
			res.json(data);
		});

});
router.get('/GetPage/:_id',function(req,res,next){
		Page_Control.readPageOne(req.params._id,function(data){
			res.json(data);
		});

})

//搞認證啦

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log(token);
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, "mylittlesecret", function(err, decoded) {
    	console.log(err);
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

router.get('/users',function(req,res,next){
  User.find({}, function(err, users) {
    res.json(users);
  });
});

router.put('/updatePage/:_id',function(req,res,next){
		Page_Control.updatePage(req.params._id,req.body);
		res.json('success');
});



router.delete('/DeletePost/:_id',function(req,res,next){
		Page_Control.deletePage(req.params._id);
		//console.log(req.params._id);
		res.json({ message: 'Welcome to the coolest API on earth!' });
});
router.post('/AddPage/',function(req,res,next){

			//console.log(req.body);
		Page_Control.addPage(req.body,function(data){
      //console.log(data);
      res.json({status:'success','data':data});

    });


});

/** 以下爲高中生專區內容**/

router.post('/editSeniorPage',function(req,res,next){
  console.log(req.body);
  dictionary[req.body.name]=req.body.value;
 console.log(dictionary);

  res.json({message:"success"});
});


module.exports = router;
