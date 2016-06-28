var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var pool = mysql.createPool({
	hotst : 'localhost',
	user  : 'root',
	password : 'bj03wu3ej/ t/6',
	database : 'fju_website'
//資料庫資料
});

/*
    授課教師查詢
*/
router.get ('/teacher',function(req,res,next) {
  console.log(req.query);
  var JSON_Object;  //接收查詢資料的物件
  pool.getConnection(function(err, connection) {
    // Use the connection
     connection.query( 'SELECT * FROM teacher', function(err, rows) {
       if(err){console.log(err);}
       // And done with the connection.
       res.jsonp(rows);
       connection.release();
       // Don't use the connection here, it has been returned to the pool.
     });
  });
});


/*
查詢畢業生論文 帶參數name可以使用,name為教師名稱
*/
router.get('/teacher/gradude',function(req,res,next){
  pool.getConnection(function(err,connection){
  connection.query('SELECT  `GRA_YEAR`,`GRA_TITLE`,`GRA_TEACHER`,`GRA_STUDENT`  FROM `teacher`,`graduation` WHERE teacher.TEA_LDAP=graduation.GRA_TEACHER and teacher.name_cn =' + req.query.name +
		   ' ORDER BY `graduation`.`GRA_YEAR` DESC' ,function(err,rows){
	if(err){console.log(err);}
	res.json(rows);
  connection.release();
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
  connection.release();
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
  connection.release();
	});
   });
});

/*
輸入教師資料
*/
router.post('/teacher_post',function(req,res,next){
	pool.getConnection(function(err,connection){
		dataFromUser=req.body;
		console.log(req.body);
		SQL= ' UPDATE teacher SET name_cn= ? ,job_title= ?,specialty_1= ?,specialty_2= ?,specialty_3= ?  WHERE name_cn = ? ';
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
router.get('/bulletin',function(req,res,next) {
  console.log("獲取新聞");
  console.log(req.query);
  pool.getConnection(function(err, connection) {
		if(!req.query.limit || req.query.limit > 20)
			limit =10;
		else {
			limit=req.query.limit;
		}
    // Use the connection
     SQL  = "SELECT * FROM `news` WHERE 1 LIMIT " + limit;
     connection.query( SQL , function(err, rows) {
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
  console.log(req.query);
  pool.getConnection(function(err, connection) {
    // Use the connection

     SQL  = "INSERT INTO `news`(`Publisher`, `Content`) VALUES (?,?)";
          connection.query( SQL ,[req.body.publisher,req.body.content], function(err, rows) {
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

     SQL  = "UPDATE `news` SET `Publisher`=?,`Content`=? WHERE PK=?";
          connection.query( SQL ,[req.body.publisher,req.body.content,req.params.id], function(err, rows) {
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







module.exports = router;
