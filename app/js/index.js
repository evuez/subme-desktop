'use strict';

window.$ = window.jQuery = require('../lib/jquery');

var holder = document.getElementById('holder');
var $queue = $('#queue');
var job = '<div class="job"><div class="job__file"></div><div class="job__status is-pending"></div></div>';


var queueJob = function(file) {
	var $job = $(job);
	$job.find('.job__file').first().text(file.path);
	$queue.append($job);
};


holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
	this.className = '';
	e.preventDefault();

	var file = e.dataTransfer.files[0];
	var reader = new FileReader();

	// reader.onload = function (event) {
	// 	console.log(event.target);
	// 	holder.style.background = 'url(' + event.target.result + ') no-repeat center';
	// };

	queueJob(file);

	console.log(file);
	reader.readAsDataURL(file);
	return false;
};

