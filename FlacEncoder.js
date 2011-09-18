require('./StringExtensions');
var exec = require('child_process').exec,
	step = require('step');

function FlacEncoder(inputDirectiory) {
	this.inDir = inputDirectiory;
};

FlacEncoder.prototype.encode = function(filepath){
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
				  exec('rm test.wav', {cwd:this.inDir}, this);
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

FlacEncoder.prototype.decodeFlac = function(filename, cb){
		var command = 'ffmpeg -y -i ' +
						filename + ' ' +
						filename.replaceExtension('.wav');
						
		exec(command, {cwd:this.inDir},
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

FlacEncoder.prototype.convertToMp3 = function(inputFile, bitrate, cb){
		var command = 'lame -b ' + bitrate + ' ' 
			+ inputFile + ' ' + 
			inputFile.replaceExtension('_'+bitrate+'.mp3');
		exec(command, {cwd:this.inDir},
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

var e = new FlacEncoder('spec/res/');
e.encode('test.flac');
