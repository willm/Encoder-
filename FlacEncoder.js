require('./StringExtensions');
var exec = require('child_process').exec,
	step = require('step'),
	path = require('path'),
	fs = require('fs');

exports.FlacEncoder = function (inputDirectiory) {
	this.inDir = inputDirectiory;
	this.outDir = path.join(inputDirectiory,'out');
};

exports.FlacEncoder.prototype.encode = function(filepath){
	var that = this,
		filename = path.basename(filepath);
	fs.mkdir(that.outDir,0777);
	if(filepath.endsWith('.flac')){
		step(
				function () {
				  that.decodeFlac(filepath,this);
				},
				function () {
				  that.convertToMp3(filepath.replaceExtension('.wav'), 320,this);
				  that.convertToMp3(filepath.replaceExtension('.wav'), 128,this);
				  that.convertToMp3(filepath.replaceExtension('.wav'), 64,this);
				  that.convertToM4A(filepath.replaceExtension('.wav'), 320,this);
				},
				function () {
				//remove uneccessary wav file
				  fs.unlink(filepath.replaceExtension('.wav'));
				  that.clipMp3(path.join(this.outDir,filename.replaceExtension('_64.mp3')),this);
				},
				function () {
				//remove full length 64kbps file
				console.log('PROBLEM DIR: ' + path.join(that.outDir,filename.replaceExtension('_64.mp3')));
				
				  fs.unlink(path.join(that.outDir,filename.replaceExtension('_64.mp3')));
				}
			);
		}
	else{
		/*throw{
				name:'InvalidFileError',
				message:'Please encode a flac file'
			};*/
	}
};

exports.FlacEncoder.prototype.executeCommand = function (command, err,cb) {
  exec(command, {cwd:this.inDir},function (error, stout, sterr) {
  			  console.log(command);
			  //console.log('stout: ' + stout);
			  //console.log('sterr: ' + sterr);
			  if(error !== null){
				  throw{
				  	name:err,
				  	message: error
				  	};
			  }
			  cb();
			})
};

exports.FlacEncoder.prototype.decodeFlac = function(filename, cb){
		var command = 'ffmpeg -y -i ' +
						filename + ' ' +
						filename.replaceExtension('.wav');
		console.log(command + ' : ' + this.inDir);
		this.executeCommand(command, 'FlacDecodeError', cb);
};

exports.FlacEncoder.prototype.convertToMp3 = function(inputFile, bitrate, cb){
		var currentfilename = path.basename(inputFile);
		var command = 'lame -b ' + bitrate + ' ' 
			+ inputFile + ' ' + 
			path.join(this.outDir,currentfilename.replaceExtension('_'+bitrate+'.mp3'));
		this.executeCommand(command, 'Mp3EncodeError', cb);
};

exports.FlacEncoder.prototype.clipMp3 = function(inputFile, cb){
		var currentfilename = path.basename(inputFile);
		var command = 'ffmpeg -ss 0 -t 30 -i ' + path.join(this.outDir,currentfilename) + ' -acodec copy ' + 
			path.join(this.outDir,currentfilename.replaceExtension('_mp3clip.mp3'));
			console.log("COMMAND: " + command);
		this.executeCommand(command, 'ClippingError', cb);
};

exports.FlacEncoder.prototype.convertToM4A = function(inputFile, bitrate, cb){
		var currentfilename = path.basename(inputFile);
		var kbpsinbps =  0.0009765625,
			bitrate = bitrate/kbpsinbps,
			command = 'wine '+ path.join(__dirname,'lib','win32','neroAacEnc.exe') + ' -br ' + bitrate + ' ' +
				'-if ' + inputFile + ' ' + 
				'-of ' + path.join(this.outDir,currentfilename.replaceExtension('.m4a'));
		this.executeCommand(command, 'M4AEncodeError', cb);
};


