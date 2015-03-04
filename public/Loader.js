'use strict'

var Auto = Auto || {};

Auto.Loader = function(source, fn) {
	this.content = "";
	var that = this;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", source, true);
	xhr.onload = function(e) {
		that.content = e.target.responseText;
		if (fn) fn();
	};
	xhr.send();
};