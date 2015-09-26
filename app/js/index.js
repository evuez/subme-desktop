'use strict';

/**
 * Since I'm quite the contrary of "fluent" in Javascript,
 * I have no idea what I'm doing.
 */

window.$ = window.jQuery = require('../lib/jquery');

var OpenSubtitlesAPI = require('opensubtitles-api');
var http = require('http');
var fs = require('fs');

var OpenSubtitles = new OpenSubtitlesAPI('evuez')
var holder = document.getElementById('holder');
var $queue = $('#queue');
var job = '<div class="job"><div class="job__file"></div><div class="job__status is-pending"></div></div>';


var configuration = JSON.parse(fs.readFileSync('configuration.json', 'utf8'));


var queueJob = function(file, callback) {
	var $job = $(job);
	$job.find('.job__file').first().text(file.path);
	$queue.append($job);

	callback(file, $job);
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

	console.log(file);

	if (fs.lstatSync(file.path).isDirectory()) {
		var files = fs.readdirSync(file.path);
		for (var i = 0; i < files.length; i++) {
			var filepath = file.path + '/' + files[i];

			if (!fs.lstatSync(filepath).isDirectory()) {
				queueJob({'path': filepath}, processQueue);
			}
		}
	} else {
		queueJob(file, processQueue);
	}

	return false;
};

function processQueue(file, $job) {
	$job.find('.job__status').first().removeClass('is-pending');
	$job.find('.job__status').first().addClass('is-started');
	OpenSubtitles.search({
		path: file.path,
	}).then(function (subtitles) {
		for (var i = 0; i < configuration.languages.length; i++) {
			if (configuration.languages[i] in subtitles) {
				var sublang = subtitles[configuration.languages[i]];
				break;
			}
		}

		var subfile = fs.createWriteStream(file.path.split('.')[0] + '.' + sublang.url.split('.').pop());
		var request = http.get(sublang.url, function(response) {
			response.pipe(subfile);
			$job.find('.job__status').first().removeClass('is-started');
			$job.find('.job__status').first().addClass('is-done');
		});
	});
}

