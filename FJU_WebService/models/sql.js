
var mysql = require('mysql');
//這邊是要建立MySQL的model模組
var connection = mysql.createConnection({
	host 	 : 'localhost',	//主機名稱
	user 	 : 'root', 	//使用者名稱
	password : 'bj03wu3ej/ t/6', 	//密碼
	database : 'fju_website'	//Database Name
});



exports= module.exports=connection;
