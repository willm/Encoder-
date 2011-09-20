//nicked from http://nodejs.org/docs/v0.5.6/api/crypto.html

var crypto = require('crypto'),
	fs = require('fs'),
	shasum = crypto.createHash('sha1');

exports.generateFileHash = function (filename){
	var stream = fs.ReadStream(filename),
		that = this;
	stream.on('data', function(data) {
	  shasum.update(data);
	});

	stream.on('end', function() {
		var data = shasum.digest('hex');
		console.log(data + '  ' + filename);
	});
};


