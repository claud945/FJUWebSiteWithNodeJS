//產生排版系統

/*
 *資料新增系統
 *  MENU->增加目錄
 *
 *
 */
var mongoose = require('mongoose'); //匯入NOSQL模組
var Schema = mongoose.Schema; //使用Mongoose Schema
var PageController = new Schema({
    page_name: String,
    user_id: String,
    type:String,
    group:String,
    content: String,
    DATA: Object,
    updated_at: { type: Date, default: Date.now }
});
var PAGE_MODEL = mongoose.model('PageController', PageController);
mongoose.connect('mongodb://localhost/');

module.exports = exports = {
    //獲得PageList
    list: function(callback){
        PAGE_MODEL.find({},"page_name group",{sort:{group:1}},function(err,data){
            if(!err){

                callback(data);


            }else
            console.log(err);

        })

    },

    addPage: function(Obj,callback) {
        var PageModel = new PAGE_MODEL();
        //console.log(Obj);
        // Set the beer properties that came from the POST data
        PageModel.page_name=Obj.name;
        PageModel.type=Obj.type;
        PageModel.user_id=Obj.user_id;
        PageModel.group=Obj.group;

        PageModel.DATA =Obj;


        // Save the beer and check for errors
        PageModel.save(function(err,page) {
            console.log(page);
            if (err)
                console.log(err);
            callback(page);
        });

    },

    deletePage: function(_id) {
        PAGE_MODEL.findByIdAndRemove({ _id: _id }, function(err) {
            if (!err) {
                //message.type = 'notification';
                console.log('success');

            } else {
                console.log('fall');
            }
            //console.log(message.type);
        });
    },




    updatePage: function(_id,data) {
        PAGE_MODEL.findById({ _id: _id }, function(err,blob) {
             //find the document by ID
            //update it
            blob.update({
                page_name : data.page_name,
                type:data.type,
                user_id:data.user_id,
                group:data.group,
                updated_at:null,//血時間
                DATA :data,
            }, function (err, blobID) {
              if (err) {
                  res.send("There was a problem updating the information to the database: " + err);
              }
              else {

               }
            })
        });






    },

    readPage: function(callback) {

        PAGE_MODEL.find({},{},{sort:{group:1}},function(err, data) {
            if (!err) {
            	//console.log(data);
            	//this.data=data;

            	callback(data);
            }
			else
            	console.log(err);}
            );


    },

    readPageOne: function(_id,callback) {

        PAGE_MODEL.findById(_id,function(err, data) {
            if (!err) {
                //console.log(data);
                //this.data=data;

                callback(data);
            }
            else
                console.log(err);}
            );


    }


}
