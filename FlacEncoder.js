require('./StringExtensions');
var nexpect = require('nexpect'),
	step = require('step');

function Encoder() {};

Encoder.prototype.encode = function(filepath){
	var that = this;
	if(filepath.endsWith('.flac')){
		step(
			function () {
			  that.decodeFlac(filepath,this);
			},
			function () {
			  console.log('hi ther eeeee');
			});
		}
	else{
		throw{
				name:'InvalidFileError',
				message:'Please encode a flac file'
			};
	}
};

Encoder.prototype.decodeFlac = function(filepath){
		nexpect.spawn('ffmpeg -y -i '+filepath + ' ' + 'test.wav')
			.expect()
			.run(function (err) {
				if (err) {
					console.log(err);
				}
				console.log('success');
			});
};

Encoder.prototype.compressDecodedFlac = function(){
		console.log('grgbsdfbvsdfbsdfbsdfbdfbfdbsdfbdf');
		nexpect.spawn('lame test.wav test.mp3', {verbose:true})
			.run(function (err) {
				if (err) {
					console.log(err);
				}
				console.log('success');
			});
}

var e = new Encoder();
e.encode('spec/res/test.flac');
