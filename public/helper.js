'use strict'

var Auto = Auto || {};

Auto.helper = {
	splitWords: function(text) {
		var regex = /([a-z]('[a-z])?)+/g;
		var lowerText = text.toLowerCase();
		var result;
		var words = [];
		while((result = regex.exec(lowerText))) {
			words.push(result[0]);
		}
		return words;
	},
	pairWords: function(words) {
		var wordPairs = [];
		for (var i = 0; i < words.length - 1; i ++) {
			wordPairs.push([words[i], words[i+1]]);
		}
		return wordPairs;
	}
};
