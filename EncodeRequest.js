var flacEncoder = require('./FlacEncoder'),
	fs = require('fs'),
	nowjs = require('now'),
	path = require('path');

exports.respond = function (req){
	var folder = req.param('input-folder', null),
		encoder;
	encoder = new flacEncoder.FlacEncoder(folder);
	console.log('folder : '+ folder);
	fs.readdir(folder, function (err,files){
		if(err)
			console.log(err);
		for(var i=0; i<files.length; i++){
			console.log(path.join(folder,files[i]));
			encoder.encode(path.join(folder,files[i]));
			}
	});
	
	
}
