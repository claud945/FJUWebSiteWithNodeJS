var MetaInspector = require('node-metainspector');
var client = new MetaInspector("", { timeout: 5000 });

client.on("fetch", function(){
	console.log(client.title);
});

client.on("error", function(err){
	    console.log(err);
});

client.fetch();

