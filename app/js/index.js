'use strict';

var holder = document.getElementById('holder');
var queue = document.getElementById('queue');


var queueFile = function(file) {
	var jobRow = queue.insertRow(queue.rows.length);
	var fileCell = jobRow.insertCell(0);
	fileCell.appendChild(document.createTextNode(file.path));
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

	queueFile(file);

	console.log(file);
	reader.readAsDataURL(file);
	return false;
};

