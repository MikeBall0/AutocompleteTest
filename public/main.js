'use strict'

var Auto = Auto || {};

Auto.main = function() {
	var trained = false;
	var input = document.getElementById("input");
	var totalBooks = 4;
	var booksComplete = 0;
	function updateTrainingProgress() {
		booksComplete ++;
		input.value += "(" + booksComplete + "/" + totalBooks + ")";
	};
	input.value += "Training on literature, please be patient...\n"
	Auto.Model.train("sources/sherlock.txt", function() {
		updateTrainingProgress();
		input.value += "Training complete on Sherlock Holmes\n";
		Auto.Model.train("sources/mobydick.txt", function() {
			updateTrainingProgress();
			input.value += "Training complete on Moby Dick\n";
			Auto.Model.train("sources/sawyer.txt", function() {
				updateTrainingProgress();
				input.value += "Training complete on Tom Sawyer\n";
				Auto.Model.train("sources/musketeers.txt", function() {
					updateTrainingProgress();
					input.value += "Training complete on The Three Musketeers\n";
					input.value += ("Done training.\n");
					trained = true;
				});
			});
		});
	});
	var predictionHandler = function(e) {
		if (!trained) return;
		input.removeEventListener("input", predictionHandler);
		var userInput = input.value;
		if (userInput.slice(-1).match(/[a-zA-Z' ]/)) {
			var userInputLength = userInput.length;
			var words = Auto.helper.splitWords(userInput, words);
			var thisWord;
			if (userInput.slice(-1).match(/[a-zA-Z']/)) {
				thisWord = words.pop();
				if (userInput.slice(-1) === "'") {
					thisWord += "'";
				}
			} else {
				thisWord = "";
			}
			var lastWord = words.pop();
			var suggestion = Auto.Model.predict(lastWord, thisWord);
			input.value += suggestion;
			input.setSelectionRange(userInputLength, userInputLength + suggestion.length);
		}
		input.addEventListener("input", predictionHandler);
	};
	input.addEventListener("input", predictionHandler);
	input.onkeydown = function(e) {
		if (e.keyCode == 8) {
			input.removeEventListener("input", predictionHandler);
		}
	};
	input.onkeyup = function(e) {
		if (e.keyCode == 8) {
			input.addEventListener("input", predictionHandler);
		}
	}
};

window.onload = Auto.main;