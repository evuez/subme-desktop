'use strict';

/**
 * Since I'm quite the contrary of "fluent" in Javascript,
 * I have no idea what I'm doing.
 */

window.$ = window.jQuery = require('../lib/jquery');

var OpenSubtitlesAPI = require('opensubtitles-api');
var OpenSubtitles = new OpenSubtitlesAPI('evuez')

var holder = document.getElementById('holder');
var $queue = $('#queue');
var job = '<div class="job"><div class="job__file"></div><div class="job__status is-pending"></div></div>';



var queueJob = function(file, callback) {
	var $job = $(job);
	$job.find('.job__file').first().text(file.path);
	$queue.append($job);

	callback(file);
};


OpenSubtitles.login()
.then(function(response) {
	console.log(response);
}).catch(function(err) {
	console.log(err);
});

holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
	this.className = '';
	e.preventDefault();

	var file = e.dataTransfer.files[0];
	var reader = new FileReader();

	queueJob(file, processQueue);

	return false;
};

function processQueue(file) {
	OpenSubtitles.search({
		path: file.path,
	}).then(function (subtitles) {
		console.log(subtitles.en.url);
	});
}

