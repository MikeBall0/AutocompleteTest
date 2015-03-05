'use strict'

var Auto = Auto || {};

Auto.Model = {
	WordsModel: {},
	WordPairsModel: {},
	trainOnFile: function(file, fn) {
		var that = this;
		var loader = new Auto.Loader(file, function() {
			that.train(loader.content);
			if (fn) fn();
		});
	},
	train: function(text) {
		var words = Auto.helper.splitWords(text);
		var wordPairs = Auto.helper.pairWords(words);
		this.accumulateWords(words);
		this.accumulateWordPairs(wordPairs);
	},
	reset: function() {
		this.WordsModel = {};
		this.WordPairsModel = {};
	},
	predict: function(previousWord, beginNextWord) {
		var prevDist = {};
		if (!!previousWord && this.WordPairsModel[previousWord] !== undefined) {
			prevDist = this.WordPairsModel[previousWord];
		}
		var bestPaired = false;
		var bestWord = "";
		var bestChance = 0;
		for (var word in this.WordsModel) {
			if (word.indexOf(beginNextWord) != 0) continue;
			var chance;
			var paired;
			if (prevDist[word] === undefined) {
				paired = false;
				chance = this.WordsModel[word];
			} else {
				paired = true;
				chance = prevDist[word];
			}
			if (paired || !bestPaired) {
				if (chance > bestChance || (paired && !bestPaired)) {
					bestWord = word;
					bestChance = chance;
					bestPaired = paired;
				}
			}
		}
		return bestWord.slice(beginNextWord.length);
	},
	accumulateWords: function(words) {
		for (var i = 0; i < words.length; i ++) {
			if (this.WordsModel[words[i]] === undefined) {
				this.WordsModel[words[i]] = 1;
			} else {
				this.WordsModel[words[i]] ++;
			}
		}
	},
	accumulateWordPairs: function(wordPairs) {
		for (var i = 0; i < wordPairs.length; i ++) {
			if (this.WordPairsModel[wordPairs[i][0]] === undefined) {
				this.WordPairsModel[wordPairs[i][0]] = {};
			}
			if (this.WordPairsModel[wordPairs[i][0]][wordPairs[i][1]] === undefined) {
				this.WordPairsModel[wordPairs[i][0]][wordPairs[i][1]] = 1;
			} else {
				this.WordPairsModel[wordPairs[i][0]][wordPairs[i][1]] ++;
			}
		}
	}
};