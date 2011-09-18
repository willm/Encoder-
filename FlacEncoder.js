require('./StringExtensions');
var exec = require('child_process').exec,
	step = require('step'),
	path = require('path');

function FlacEncoder(inputDirectiory) {
	this.inDir = inputDirectiory;
	this.outDir = 'out/';
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
				  that.convertToMp3('test.wav', 64,this);
				  that.convertToM4A('test.wav', 320,this);
				},
				function () {
				  exec('rm test.wav', {cwd:that.inDir});
				  that.clipMp3('test_64.mp3',this);
				},
				function () {
				  exec('rm '+that.outDir +'test_64.mp3', {cwd:that.inDir}, this);
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
			this.outDir + inputFile.replaceExtension('_'+bitrate+'.mp3');
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

FlacEncoder.prototype.clipMp3 = function(inputFile, cb){
		var command = 'ffmpeg -ss 0 -t 30 -i ' + this.outDir + inputFile + ' -acodec copy ' + 
			this.outDir + inputFile.replaceExtension('_mp3clip.mp3');
		exec(command, {cwd:this.inDir},
			function (error, stout, sterr) {
			  console.log('stout: ' + stout);
			  console.log('sterr: ' + sterr);
			  if (error !== null) {
			    throw{
			    	name:'FFMpegError',
			    	message:error
			    };
			  }
			cb();
			});
};

FlacEncoder.prototype.convertToM4A = function(inputFile, bitrate, cb){
		var kbpsinbps =  0.0009765625,
			bitrate = bitrate/kbpsinbps,
			command = 'wine ../../lib/win32/neroAacEnc.exe -br ' + bitrate + ' ' +
				'-if ' + inputFile + ' ' + 
				'-of ' + this.outDir + inputFile.replaceExtension('.m4a');
			
		exec(command, {cwd:this.inDir},
			function (error, stout, sterr) {
			  console.log('stout: ' + stout);
			  console.log('sterr: ' + sterr);
			  if (error !== null) {
			    throw{
			    	name:'NeroError',
			    	message:error
			    };
			  }
			cb();
			});
};



var e = new FlacEncoder(path.join(__dirname,'spec','res'));
e.encode('test.flac');
