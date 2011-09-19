require('./StringExtensions');
var exec = require('child_process').exec,
	step = require('step'),
	path = require('path'),
	fs = require('fs');

function FlacEncoder(inputDirectiory) {
	this.inDir = inputDirectiory;
	this.outDir = path.join(inputDirectiory,'out');
	this.ffmpeg = path.join(__dirname,'lib','ffmpeg-0.5', 'ffmpeg.exe');
	this.lame = path.join(__dirname,'lib','lame3.98.4', 'lame.exe');
	this.nero = path.join(__dirname,'lib','nero1.5.1', 'win32', 'neroAacEnc.exe');
};

FlacEncoder.prototype.encode = function(filepath){
	var that = this;
	fs.mkdir(that.outDir,0777);
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
				//remove uneccessary wav file
				  fs.unlink(path.join(that.inDir,'test.wav'));
				  that.clipMp3('test_64.mp3',this);
				},
				function () {
				//remove full length 64kbps file
				  fs.unlink(path.join(that.outDir,'/test_64.mp3'), this);
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

FlacEncoder.prototype.executeCommand = function (command, err,cb) {
  exec(command, {cwd:this.inDir},function (error, stout, sterr) {
  			  console.log(command);
			  console.log('stout: ' + stout);
			  console.log('sterr: ' + sterr);
			  if(error !== null){
				  throw{
				  	name:err,
				  	message: error
				  	};
			  }
			  cb();
			})
};

FlacEncoder.prototype.decodeFlac = function(filename, cb){
		var command =  this.ffmpeg +' -y -i ' +
						filename + ' ' +
						filename.replaceExtension('.wav');
		console.log(command + ' : ' + this.inDir);
		this.executeCommand(command, 'FlacDecodeError', cb);
};

FlacEncoder.prototype.convertToMp3 = function(inputFile, bitrate, cb){
		var command = this.lame +' -b ' + bitrate + ' ' 
			+ inputFile + ' ' + 
			path.join(this.outDir,inputFile.replaceExtension('_'+bitrate+'.mp3'));
		this.executeCommand(command, 'Mp3EncodeError', cb);
};

FlacEncoder.prototype.clipMp3 = function(inputFile, cb){
		var command = this.ffmpeg +' -ss 0 -t 30 -i ' + path.join(this.outDir,inputFile) + ' -acodec copy ' + 
			path.join(this.outDir,inputFile.replaceExtension('_mp3clip.mp3'));
			console.log("COMMAND: " + command);
		this.executeCommand(command, 'ClippingError', cb);
};

FlacEncoder.prototype.convertToM4A = function(inputFile, bitrate, cb){
		var kbpsinbps =  0.0009765625,
			bitrate = bitrate/kbpsinbps,
			command = this.nero+' -br ' + bitrate + ' ' +
				'-if ' + inputFile + ' ' + 
				'-of ' + path.join(this.outDir,inputFile.replaceExtension('.m4a'));
		this.executeCommand(command, 'M4AEncodeError', cb);
};

var e = new FlacEncoder(path.join(__dirname,'spec','res'));
e.encode('test.flac');
