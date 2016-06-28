var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var pool = mysql.createPool({
	hotst : 'localhost',
	user  : 'root',
	password : 'bj03wu3ej/ t/6',
	database : 'fju'
//資料庫資料
});

/* GET users listing.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/
router.get ('/',function(req,res,next) {
  console.log(req.query);
  var JSON_Object;  //接收查詢資料的物件
  pool.getConnection(function(err, connection) {
    // Use the connection
     connection.query( 'SELECT * FROM teacher', function(err, rows) {
       // console.log(rows); 輸出結果;
       if(err){console.log(err);}
       JSON_Object=rows; // 請問要如何將 'rows' 回傳至外部的變數？
       // And done with the connection.
       res.jsonp(rows);
       connection.release();

       // Don't use the connection here, it has been returned to the pool.
     });
  });

});


/*
    佈告欄的部分
*/

router.get ('/:bulletin',function(req,res,next) {
  console.log(req.query);
  var JSON_Object;  //接收查詢資料的物件
  pool.getConnection(function(err, connection) {
    // Use the connection
     connection.query( 'SELECT * FROM bulletin WHERE ROWNUM <11 ', function(err, rows) {
       // console.log(rows); 輸出結果;
       if(err){console.log(err);}
       JSON_Object=rows; // 請問要如何將 'rows' 回傳至外部的變數？
       // And done with the connection.
       res.jsonp(rows);
       connection.release();

       // Don't use the connection here, it has been returned to the pool.
     });
  });

});


module.exports = router;
