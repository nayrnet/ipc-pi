#!/usr/bin/nodejs
// IPCPI Monitor - IPCamera Pi Monitor

// Load Configuration
var	options		= require('./config').options;
var	feeds		= require('./config').feeds;

// Load Modules
var	exec  	= require('child_process').exec;
var	util	= require('util');

// Globals
var	getRes	= 'lib/getRes.sh';
var	defOpts = '--lavfdopts probesize:25000 --no-keys -p --live --timeout 30 --aspect-mode fill --layer 2';
var	timer;

// First: Get Display Resilution
res = exec(getRes, function (error, stdout, stderr) {
	var mode = stdout.toString().split('x')
	console.log('resolution: ' + stdout.toString());
	if(options.ribbon) {
		ribbonCalc(mode[0],mode[1],feeds.length);
	}
});

function ribbonCalc(width,height,number) {
	right = width / (number-1)
	top = height - Math.round(right/1.77778)
	left = 0
	bottom = parseInt(height)
	i = 1
	runCam(0,0,width,top,feeds[0])
	while (i < number) {
		runCam((right*i)-right,top,right*i,bottom,feeds[i])
		i++
	}
}

function runCam(a,b,y,z,uri) {
	var cmd	= 'omxplayer ' + defOpts + ' --win "' + a + ' ' + b + ' ' + y + ' ' + z + '" "' + uri + '"';
	console.log(cmd)
	cam = exec(cmd, function (error, stdout, stderr) {
		console.log('resolution: ' + stdout);
	});
	cam.on('close', (code, signal) => {
		console.log('Closed!')
		clearTimeout(timer)
		timer = setTimeout(function () { runCam(a,b,y,z,uri) }, 15000)	// Retry every 15s
	});
}
