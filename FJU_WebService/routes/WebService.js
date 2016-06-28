var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var jwt = require('jsonwebtoken');
var app =express();
var config = require('../config'); // get our config file
var User   = require('../models/users'); // get our mongoose model

app.set('superSecret', config.secret); // secret variable

var pool = mysql.createPool({
	host : 'localhost', //使用者
	user  : 'root', //帳號
	password : 'bj03wu3ej/ t/6', //密碼
	database : 'fju_website' //資料庫資料
});





/*
    授課教師查詢
*/
router.get ('/teacher',function(req,res,next) { //路由器抓取授課老師資料
  console.log(req.query);
  var JSON_Object;  //接收查詢資料的物件
  pool.getConnection(function(err, connection) {
    // Use the connection 使用連接
     connection.query( 'SELECT * FROM teacher', function(err, rows) {
       if(err){console.log(err);}
       // And done with the connection.與連接完成
       res.jsonp(rows);

       connection.release();
       // 不要在這裡使用的連接，它已被返回到集區
     });
  });

});
/*
查詢畢業生論文 帶參數name可以使用,name為教師名稱
*/ 
router.get('/teacher/gradude',function(req,res,next){  //路由器抓取授課老師資料
  pool.getConnection(function(err,connection){
  connection.query('SELECT  `GRA_YEAR`,`GRA_TITLE`,`GRA_TEACHER`,`GRA_STUDENT`  FROM `teacher`,`graduation` WHERE teacher.TEA_LDAP=graduation.GRA_TEACHER and teacher.name_cn =' + req.query.name +
		   ' ORDER BY `graduation`.`GRA_YEAR` DESC' ,function(err,rows){
	if(err){console.log(err);}// 與連接完成
	res.json(rows);
  connection.release(); // 
	});
   });
});


/*
查詢教師經歷
*/
router.get('/teacher/detail_exp',function(req,res,next){
  pool.getConnection(function(err,connection){
		sql ='SELECT teacher.name_cn,tea_exp.TEA_EXP_PER,tea_exp.TEA_EXP_UNIT,tea_exp.TEA_EXP_DEP,tea_exp.TEA_EXP_TITLE FROM teacher,tea_exp where teacher.TEA_CODE=tea_exp.TEA_CODE and teacher.name_cn=';
  connection.query( sql + req.query.name + "ORDER BY `tea_exp`.`TEA_EXP_PER` DESC " ,function(err,rows){
	if(err){console.log(err);}
	res.json(rows);
  connection.release(); // 
	});
   });
});


/*
查詢教師學歷
*/

router.get('/teacher/detail_edu',function(req,res,next){
  pool.getConnection(function(err,connection){
		sql ='SELECT teacher.name_cn,tea_edu.TEA_SCH,tea_edu.TEA_DEP,tea_edu.TEA_DEG FROM teacher,tea_edu where teacher.TEA_CODE=tea_edu.TEA_CODE and teacher.name_cn=';
  connection.query( sql + req.query.name  ,function(err,rows){
	if(err){console.log(err);}
	res.json(rows);
  connection.release(); // 
   });
});

/*
輸入教師資料
*/
router.post('/teacher_post',function(req,res,next){
	pool.getConnection(function(err,connection){
		dataFromUser=req.body;
		console.log(req.body);
		SQL= ' UPDATE teacher SET name_cn= ? ,job_title= ?,specialty_1= ?,specialty_2= ?,specialty_3= ?  WHERE pk = name_pk = ? ';
		console.log(SQL);
		connection.escape(SQL);
		connection.query(SQL,[dataFromUser.name_cn,dataFromUser.job_title,dataFromUser.specialty_1,dataFromUser.specialty_2,dataFromUser.specialty_3,dataFromUser.name_cn],function(err,result){
			console.log(err);
			res.json(result);
		});

	});

});


/*
    佈告欄的部分
*/

//獲取新聞
router.get('/news',function(req,res,next) {
  console.log("獲取新聞");
  console.log(req.query);
  pool.getConnection(function(err, connection) {
    if(!req.query.limit || req.query.limit > 20)
      limit =30;
    else {
      limit=req.query.limit;
    }
    // Use the connection
     SQL  = "SELECT * FROM `news` ORDER BY `news`.`Date` DESC LIMIT " + limit;
     connection.query( SQL , function(err, rows) {
       // console.log(rows); 輸出結果; 取得資料順序由大到小排序
       if(err){console.log(err);}
       // And done with the connection.
       res.jsonp(rows);
       connection.release();
       // Don't use the connection here, it has been returned to the pool.

/**
*  搜尋工具
     });
  });
});



*/
router.get('/search',function(req,res,next){
	console.log('go searching');
	keyword = '\'%'+ req.query.keyword+'%\'';
	//SQL = "SELECT * FROM `fju_website`.`graduation` WHERE (CONVERT(`GRA_CODE` USING utf8) LIKE \'%蔡%\' OR CONVERT(`GRA_YEAR` USING utf8) LIKE \'%蔡%\' OR CONVERT(`GRA_TITLE` USING utf8) LIKE \'%蔡%\' OR CONVERT(`GRA_TEACHER` USING utf8) LIKE \'%蔡%\' OR CONVERT(`GRA_STUDENT` USING utf8) LIKE "+keyword+" OR CONVERT(`GRA_PATH` USING utf8) LIKE \'%蔡%\' OR CONVERT(`SecondTeacher` USING utf8) LIKE \'%蔡%\')";
//gradude.GRA_TEACHER==teacher.TEA_LDAP AND
	SQL = "SELECT * FROM Finding  WHERE  (CONVERT(name_cn USING utf8) LIKE "+keyword+" OR CONVERT(`GRA_CODE` USING utf8) LIKE  "+keyword+"  OR CONVERT(`GRA_YEAR` USING utf8) LIKE  "+keyword+"  OR CONVERT(`GRA_TITLE` USING utf8) LIKE  "+keyword+"  OR CONVERT(`GRA_TEACHER` USING utf8) LIKE  "+keyword+"  OR CONVERT(`GRA_STUDENT` USING utf8) LIKE "+keyword+" OR CONVERT(`GRA_PATH` USING utf8) LIKE  "+keyword+"  OR CONVERT(`SecondTeacher` USING utf8) LIKE  "+keyword+" )" +"ORDER BY `GRA_YEAR` DESC";
	pool.getConnection(function(err,connection){
	connection.query(SQL,function(err,rows){
		if(err)console.log(err);
	  res.json(rows);
    connection.release(); // Don't use the connection here, it has been returned to the pool.不要在這裡使用的連接，它已被返回到集區
		});
  });
});

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





/*
新增教師
*/
router.post('/teacher_add',function(req,res,next){
  pool.getConnection(function(err, connection) {
    // Use the connection
     SQL  = "INSERT INTO `teacher` SET ?"
          connection.query( SQL , req.body , function(err, rows) {
       // console.log(rows); 輸出結果;
       if(err){console.log(err);}
       // And done with the connection.
       res.jsonp(rows);
       connection.release();
       // Don't use the connection here, it has been returned to the pool.
     });
  });
});

/*
刪除教師
*/
router.delete('/teacher_delete/:id',function(req,res,next){
  pool.getConnection(function(err, connection) {
    // Use the connection

     SQL  =  "DELETE FROM `teacher` WHERE pk=?";
          connection.query( SQL ,[req.params.id], function(err, rows) {
       // console.log(rows); 輸出結果;
       if(err){console.log(err);}
       // And done with the connection.
       res.jsonp(rows);
       connection.release();
       // Don't use the connection here, it has been returned to the pool.
     });
  });
});

/*
修改教師
*/
router.put('/teacher_edit/:id',function(req,res,next){
  pool.getConnection(function(err, connection) {
    // Use the connection

     SQL  = "UPDATE  `teacher` SET ? WHERE pk = ? "
          connection.query( SQL ,[req.body,req.params.id], function(err, rows) {
       // console.log(rows); 輸出結果;
       if(err){console.log(err);}
       // And done with the connection.
       res.jsonp(rows);
       connection.release();
       // Don't use the connection here, it has been returned to the pool.
     });
  });
});

//刪除新聞
router.delete('/news/:id',function(req,res,next) {
  console.log(req.query);
  pool.getConnection(function(err, connection) {
    // Use the connection

     SQL  =  "DELETE FROM `news` WHERE pk=?";
          connection.query( SQL ,[req.params.id], function(err, rows) {
       // console.log(rows); 輸出結果;
       if(err){console.log(err);}
       // And done with the connection.
       res.jsonp(rows);
       connection.release();
       // Don't use the connection here, it has been returned to the pool.
     });
  });
});


//修改新聞
router.put('/news/:id',function(req,res,next) {
  console.log(req.query);
  pool.getConnection(function(err, connection) {
    // Use the connection

     SQL  = "UPDATE `news` SET Title=?,CoverPhoto=?,Publisher=?,Content=? WHERE PK=?";//修改表格中的資料
          connection.query( SQL ,[req.body.Title,req.body.CoverPhoto,req.body.Publisher,req.body.Content,req.params.id], function(err, rows) {
       // console.log(rows); 輸出結果;
       if(err){console.log(err);}
       // And done with the connection.
       res.jsonp(rows);
       connection.release();
       // Don't use the connection here, it has been returned to the pool.
     });
  });
});
//新增新聞
router.post('/news/create',function(req,res,next) {
  pool.getConnection(function(err, connection) {
    // Use the connection
    console.log("新增新聞：" , req.body);

     SQL  = "INSERT INTO `news` SET ?"
          connection.query( SQL , req.body , function(err, rows) {
       // console.log(rows); 輸出結果;
       if(err){console.log(err);}
       // And done with the connection.
       res.jsonp(rows);
       connection.release();
       // Don't use the connection here, it has been returned to the pool.
     });
  });
});





module.exports = router;
