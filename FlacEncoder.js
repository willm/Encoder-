require('./StringExtensions');
var exec = require('child_process').exec,
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
			  that.convertToMp3('test.wav', 320,this);
			  that.convertToMp3('test.wav', 128,this);
			  that.convertToMp3('test.wav', 256,this);
			},
			function () {
			  exec('rm test.wav', {cwd:'spec/res'}, this);
			}
			);
		}
	else{
		throw{
				name:'InvalidFileError',
				message:'Please encode a flac file'
			};
	}
};

Encoder.prototype.decodeFlac = function(filepath, cb){
		var command = 'ffmpeg -y -i ' +
						filepath + ' ' +
						filepath.replaceExtension('.wav');
						
		exec(command,
			function (error, stout, sterr) {
			  console.log('stout: ' + stout);
			  console.log('sterr: ' + sterr);
			  if(error !== null){
				  throw{
					name:'FlacDecodeError',
					message:error
				};
			  }
			  cb();
			});
};

Encoder.prototype.convertToMp3 = function(inputFile, bitrate, cb){
		var command = 'lame -b ' + bitrate + ' ' 
			+ inputFile + ' ' + 
			inputFile.replaceExtension('_'+bitrate+'.mp3');
		exec(command, {cwd:'spec/res'},
			function (error, stout, sterr) {
			  console.log('stout: ' + stout);
			  console.log('sterr: ' + sterr);
			  if (error !== null) {
			    throw{
			    	name:'LameError',
			    	message:error
			    };
			  }
			cb();
			});
};

var e = new Encoder();
e.encode('spec/res/test.flac');
