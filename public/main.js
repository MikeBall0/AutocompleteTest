'use strict'

var Auto = Auto || {};

Auto.main = function() {
	Auto.input = document.getElementById("input");
	document.getElementById("currentText").onclick = Auto.trainOnCurrentText;
	document.getElementById("literature").onclick = Auto.trainOnLiterature;
	document.getElementById("forget").onclick = Auto.forgetEverything;
	Auto.trainOnLiterature();
	var predictionHandler = function(e) {
		Auto.input.removeEventListener("input", predictionHandler);
		var userInput = Auto.input.value;
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
			Auto.input.value += suggestion;
			Auto.input.setSelectionRange(userInputLength, userInputLength + suggestion.length);
		}
		Auto.input.addEventListener("input", predictionHandler);
	};
	Auto.input.addEventListener("input", predictionHandler);
	Auto.input.onkeydown = function(e) {
		if (e.keyCode == 8) {
			Auto.input.removeEventListener("input", predictionHandler);
		}
	};
	Auto.input.onkeyup = function(e) {
		if (e.keyCode == 8) {
			Auto.input.addEventListener("input", predictionHandler);
		}
	}
};

Auto.trainOnLiterature = function() {
	var totalBooks = 4;
	var booksComplete = 0;
	function updateTrainingProgress() {
		booksComplete ++;
		Auto.input.value += "(" + booksComplete + "/" + totalBooks + ")";
	};
	Auto.input.value += "\nTraining on literature, please be patient...\n"
	Auto.Model.trainOnFile("sources/sherlock.txt", function() {
		updateTrainingProgress();
		Auto.input.value += "Training complete on Sherlock Holmes\n";
		Auto.Model.trainOnFile("sources/mobydick.txt", function() {
			updateTrainingProgress();
			Auto.input.value += "Training complete on Moby Dick\n";
			Auto.Model.trainOnFile("sources/sawyer.txt", function() {
				updateTrainingProgress();
				Auto.input.value += "Training complete on Tom Sawyer\n";
				Auto.Model.trainOnFile("sources/musketeers.txt", function() {
					updateTrainingProgress();
					Auto.input.value += "Training complete on The Three Musketeers\n";
					Auto.input.value += ("Done training.\n");
					Auto.input.select();
				});
			});
		});
	});
};

Auto.trainOnCurrentText = function() {
	Auto.Model.train(Auto.input.value);
	Auto.input.value += "\nTraining complete on current text.\n";
	Auto.input.select();
};

Auto.forgetEverything = function() {
	Auto.Model.reset();
	Auto.input.value += "\nEverything is forgotten.\n";
	Auto.input.select();
};

window.onload = Auto.main;