var currentQuestion = 1;

// https://stackoverflow.com/questions/962802
function shuffle(array) {
	var tmp, current, top = array.length;

	if(top) while(--top) {
		current = Math.floor(Math.random() * (top + 1));
		tmp = array[current];
		array[current] = array[top];
		array[top] = tmp;
	}

	return array;
}

function runQuiz(quiz) {
	quizToHTML(quiz);
	$('#questions input[type=submit]').on('click', function(){
		testQuiz(quiz);
	});

	$('#controls #prev').on('click', function(){
		currentQuestion--;
		currentQuestion = Math.max(1, currentQuestion);
		setShowHideQuiz(quiz);
	});

	$('#controls #next').on('click', function(){
		currentQuestion++;
		currentQuestion = Math.min(quiz.length, currentQuestion);
		setShowHideQuiz(quiz);
	});

	setShowHideQuiz(quiz);

	$('#questions').submit(function(e){
		e.preventDefault();
	});
}

function setShowHideQuiz(quiz) {
	$('.question').addClass('hidden').removeClass('active');
	if (currentQuestion == quiz.length) {
		$('#submitpage').addClass('active').removeClass('hidden');
	} else {
		$('#submitpage').addClass('hidden').removeClass('active');
		$('#question' + currentQuestion).addClass('active').removeClass('hidden');
	}
	// Reset results
	$('#result').text('');
}

function quizToHTML(quiz) {
	quiz.forEach(function(quizElement, questionID) {
		var question = quizElement.question;
		var answerList = quizElement.answers;
		var correct = quizElement.correct;

		var questionElem = $('<dt>');
		var answerListElem = $('<dd>');

		questionElem.text(question);

		// Iterate over all answers and make them into DOM objects
		var answerElems = [];
		answerList.forEach(function(answer, i) {
			var answerElem = $('<ol>');
			var answerTextElem = $('<label>');
			var answerRadioButtonElem = $('<input type="radio" value="0">');
			answerRadioButtonElem.attr('name', 'question' + questionID);
			answerRadioButtonElem.attr('id', 'question' + questionID + 'answer' + i);
			answerTextElem.attr('for', 'question' + questionID + 'answer' + i);
			answerTextElem.text(answer);
			answerElem.append(answerRadioButtonElem);
			answerElem.append(answerTextElem);
			if (i === correct) {
				answerElem.addClass('correct');
				answerRadioButtonElem.attr('value', '1');
			}
			answerElems.push(answerElem);
		});
		// Shuffle all answer DOM objects
		shuffle(answerElems);
		// And put them in the list DOM
		answerElems.forEach(function(answerElem) {
			answerListElem.append(answerElem);
		});

		var elem = $('<div class="question">');
		elem.append(questionElem);
		elem.append(answerListElem);
		elem.attr('id', 'question' + questionID);
		$('#submitpage').before(elem);
	});
}

function testQuiz(quiz) {
	var correct = 0;
	var wrong = 0;
	quiz.forEach(function(quizElement, questionID) {
		var val = $('input:checked', '#question' + questionID).val();
		if (val === '0') wrong++;
		if (val === '1') correct++;
	});
	$('#result').text(correct + ' correct and ' + wrong + ' wrong');
}
