const body = document.querySelector('body');
const container = document.querySelector('.container');
const main = document.querySelector('main');
const startBtn = document.querySelector('.start-btn');
const quesNo = document.querySelector('.ques-no');
const nextBtn = document.querySelector('#next-btn');
const reTryBtn = document.querySelector('#retryBtn');
const logo = document.querySelector('.logo');
const resultLogo = document.querySelector('.result-logo');
let questionField = document.querySelector('#question');
let options = document.querySelectorAll('.options');
const scoreText = document.querySelector('.score');
const scoreBarCorrect = document.querySelector('.score-bar-correct');
const scoreBarWrong = document.querySelector('.score-bar-wrong');
const resultMsg = document.querySelector('.result-msg');
const timer = document.querySelector('.timer');
const highestScoreEl = document.querySelector('.highest-score');
let quizData = JSON.parse(localStorage.getItem('quizData')) || {};

// Music Section*********************

// Intro Sound


const unMuteIntro = document.querySelector('#unmute-intro');
const muteIntro = document.querySelector('#mute-intro');
const introMusic = new Audio('./sounds/intro.mp3');
introMusic.loop = true;
introMusic.volume = 0.2;


unMuteIntro.addEventListener('click', ()=>{
  unMuteIntro.classList.add('hide');
  muteIntro.classList.remove('hide');
  introMusic.volume = 0;
})

muteIntro.addEventListener('click', ()=>{
  muteIntro.classList.add('hide');
  unMuteIntro.classList.remove('hide');
 
  introMusic.volume = 0.2;
  introMusic.play();
})


// for countDown timer

const countDownMusic = new Audio('./sounds/cDown.mp3');
const unMuteIcon = document.querySelector('#unmute');
const muteIcon = document.querySelector('#mute');

unMuteIcon.addEventListener('click', () => {
  unMuteIcon.classList.add('hide');
  muteIcon.classList.remove('hide');
  countDownMusic.volume = 0;
});
muteIcon.addEventListener('click', () => {
  unMuteIcon.classList.remove('hide');
  muteIcon.classList.add('hide');
  countDownMusic.volume = 1;
});

// For correct Answer
const correctAnswerMusic = new Audio('./sounds/correct.mp3');
correctAnswerMusic.volume = 0.2;
const wrongAnswerMusic = new Audio('./sounds/wrong.mp3');
wrongAnswerMusic.volume = 0.3;

// ******************************************

let highestScore;
let currentScore = quizData.currentScore || '';
let score = quizData.score || 0;
let intervalId = localStorage.getItem('intervalId') || '';
let selectedId = localStorage.getItem('selectedId') || '';
const totalTimeInSec = 30;
let correctAns;
let oldScore = localStorage.getItem('oldScore') || currentScore || 0;

if (quizData.quesNo) {
  quesNo.innerText = quizData.quesNo;
}

let bodyClass = localStorage.getItem('bodyClass');
let containerClass = localStorage.getItem('containerClass');
let mainClass = localStorage.getItem('mainClass');
let savedQuestion = localStorage.getItem('questionFieldValue');
let ulCursorStyle = localStorage.getItem('ulCursorStyle');
let optionsDisabled = localStorage.getItem('optionsDisabled');
let savedOpacity = localStorage.getItem('selectedOptOpacity');
let highestScoreClass = localStorage.getItem('highestScoreClass');
let highestScoreText = localStorage.getItem('highestScoreText');

if (highestScoreText) {
  highestScoreEl.classList = highestScoreClass;
  highestScoreEl.firstElementChild.innerText = highestScoreText;
}

if (bodyClass) {
  body.className = bodyClass;
}

if (containerClass) {
  container.className = containerClass;
}

if (mainClass) {
  main.className = mainClass;
}
if (savedQuestion) {
  questionField.innerText = savedQuestion;
}

if (ulCursorStyle) {
  [...options][0].parentElement.style.cursor = ulCursorStyle;
}

let savedOpt = JSON.parse(localStorage.getItem('savedOption'));

if (savedOpt) {
  [...options].forEach((li, i) => {
    li.innerText = savedOpt[i];
  });
}

if (savedOpt && mainClass) {
  startTimer();
}

if (optionsDisabled === 'true') {
  options.forEach((li) => {
    li.classList.add('disable-options');
  });
  clearInterval(intervalId);
}

if (savedOpacity && selectedId && bodyClass) {
  timer.innerText = 0;
  body.classList.add('quiz-bgColor2');
  body.classList.remove('quiz-bgColor1');
  body.classList.remove('quiz-bgColor3');
  nextBtn.classList.remove('hide');

  [...options].forEach((el) => {
    if (el.id === selectedId && correctAns) {
      el.style.opacity = savedOpacity;
      el.style.border = '2px solid green';
      nextBtn.classList.remove('hide');
      clearInterval(intervalId);
    }
  });
}

const savedCorrectAns = localStorage.getItem('correctAns');
if (savedCorrectAns && bodyClass) {
  timer.innerText = 0;
  clearInterval(intervalId);
  correctAns = savedCorrectAns;
  [...options].forEach((el) => {
    el.classList.add('disable-options');
    if (el.innerText.trim() === correctAns.trim()) {
      // debugger
      el.style.border = '2px solid green';
      el.style.opacity = '100%';
      nextBtn.classList.remove('hide');
      el.parentElement.style.cursor = 'not-allowed';
      localStorage.setItem('ulCursorStyle', 'not-allowed');
    }
  });
}

let wrongSelectionId = localStorage.getItem('wrongSelectionId');

if (wrongSelectionId) {
  [...options].forEach((el) => {
    if (el.id === wrongSelectionId) {
      el.style.border = '2px solid red';
      el.style.opacity = '100%';
    }
  });
}

const questions = {
  ' 1. What does JS stand for?': 'JavaScript',
  '2. Which company developed JavaScript?': 'Netscape',
  '3. What is the correct syntax to create a function in JavaScript? ':
    'function myFunction() {} ',
  '4. Which of the following is a valid variable name in JavaScript?':
    '_variable1',
  '5. What will the following code output: `console.log(typeof null)`?':
    '"object"  ',
  '6. How can you add a comment in a JavaScript code? ': '// comment',
  '7. Which operator is used to assign a value to a variable? ': '=',
  " 8. What will be the output of `console.log(2 + '2')`? ": '"22"',
  '9. Which method is used to convert a JSON string into a JavaScript object? ':
    ' JSON.parse()',
  ' 10. How do you declare a constant in JavaScript? ': 'const pi = 3.14',
};

const allOptions = {
  Q1: {
    a: 'JavaSource  ',
    b: '  JavaScript',
    c: '  JustScript  ',
    d: 'JSONScript',
  },

  Q2: {
    a: 'Microsoft',
    b: 'Netscape',
    c: 'Sun Microsystems',
    d: 'Oracle',
  },

  Q3: {
    a: 'function:myFunction() {}',
    b: 'function myFunction() {}',
    c: 'function = myFunction() {}',
    d: 'create myFunction() {}',
  },
  Q4: {
    a: '1stVariable ',
    b: 'variable-1',
    c: '_variable1',
    d: 'variable 1',
  },

  Q5: {
    a: '"object" ',
    b: '  "null"',
    c: ' "undefined"',
    d: ' "number" ',
  },

  Q6: {
    a: '<!-- comment --> ',
    b: '// comment  ',
    c: '** comment ** ',
    d: ' ## comment',
  },

  Q7: {
    a: '  -',
    b: ' =',
    c: ' ==',
    d: ':= ',
  },

  Q8: {
    a: '4 ',
    b: '"22" ',
    c: '2 ',
    d: ' "4" ',
  },

  Q9: {
    a: 'JSON.parse() ',
    b: 'JSON.stringify() ',
    c: 'JSON.toObject() ',
    d: 'JSON.convert() ',
  },

  Q10: {
    a: 'constant pi = 3.14 ',
    b: ' const pi = 3.14 ',
    c: 'var pi = 3.14 ',
    d: ' let pi = 3.14',
  },
};

const resultRemarks = [
  'Practice More, keep going!',
  'Keep learning, you have a good score!',
  'Great job, keep it up!',
];

let savedRemarks = localStorage.getItem('remarks');
if (savedRemarks) {
  resultMsg.innerText = savedRemarks;
}
let questionLength = Object.keys(questions).length;
scoreBarCorrect.style.width = `${(score / questionLength) * 100}%`;
scoreText.innerText = `${score} / ${questionLength}`;
let btnClickCount = quizData.btnCount || 0;

if (btnClickCount === questionLength + 1) {
  body.classList.add('quiz-bgColor1');
  body.classList.remove('quiz-bgColor2');
  body.classList.remove('quiz-bgColor3');
  clearInterval(intervalId);
}

if (currentScore) {
  // highestScoreEl.classList.remove('hide');
  // highestScoreEl.firstElementChild.innerText = `${currentScore}/${questionLength}`;
  highestScoreEl.classList = highestScoreClass;
  highestScoreEl.firstElementChild.innerText = highestScoreText;
  // localStorage.setItem('highestScoreClass', highestScoreEl.classList.value);
  // localStorage.setItem('highestScoreText',  highestScoreEl.firstElementChild.innerText);
}

startBtn.addEventListener('click', () => {
  introMusic.pause();
  introMusic.currentTime = 0;
  countDownMusic.currentTime = 0;
  countDownMusic.play();
  wrongSelectionId = '';
  localStorage.setItem('wrongSelectionId', wrongSelectionId);
  btnClickCount++;
  quizData.btnCount = btnClickCount;
  localStorage.setItem('quizData', JSON.stringify(quizData));

  body.classList.add('quiz-bgColor1');
  container.classList.add('quiz-started');
  main.classList.add('hide');

  localStorage.setItem('bodyClass', body.classList.value);
  localStorage.setItem('containerClass', container.classList.value);
  localStorage.setItem('mainClass', main.classList.value);

  quesNo.innerText = `${btnClickCount} / ${questionLength}`;
  quizData.quesNo = quesNo.innerText;
  localStorage.setItem('quizData', JSON.stringify(quizData));
  setQuestion();
});

nextBtn.addEventListener('click', () => {
  correctAnswerMusic.pause();
  wrongAnswerMusic.pause();
  correctAnswerMusic.currentTime = 0;
  wrongAnswerMusic.currentTime = 0;
  countDownMusic.currentTime = 0;
  countDownMusic.play();
  wrongSelectionId = '';
  localStorage.setItem('wrongSelectionId', wrongSelectionId);
  nextBtn.classList.add('hide');
  btnClickCount++;
  quizData.btnCount = btnClickCount;
  localStorage.setItem('quizData', JSON.stringify(quizData));
  resetOptions();

  if (btnClickCount > questionLength) {
    introMusic.currentTime = 0;
    introMusic.play();
    correctAnswerMusic.pause();
    wrongAnswerMusic.pause();
    correctAnswerMusic.currentTime = 0;
    wrongAnswerMusic.currentTime = 0;
    countDownMusic.currentTime = 0;
    countDownMusic.pause();
    scoreText.innerText = `${score} / ${questionLength}`;
    container.classList.remove('quiz-started');
    container.classList.add('show-result');
    localStorage.setItem('containerClass', container.classList.value);
    body.classList.remove('quiz-bgColor2');
    body.classList.remove('quiz-bgColor3');
    body.classList.add('quiz-bgColor1');
    localStorage.setItem('bodyClass', body.classList.value);

    clearInterval(intervalId);
    currentScore = score;
    quizData.currentScore = score;
    localStorage.setItem('quizData', JSON.stringify(quizData));

    showRemarks();
    showScoreBar();
  } else {
    quesNo.innerText = `${btnClickCount} / ${questionLength}`;
    quizData.quesNo = quesNo.innerText;
    localStorage.setItem('quizData', JSON.stringify(quizData));
    setQuestion();
  }
});

reTryBtn.addEventListener('click', () => {
  introMusic.pause();
  introMusic.currentTime = 0;
  countDownMusic.currentTime = 0;
  countDownMusic.play();
  wrongSelectionId = '';
  localStorage.setItem('wrongSelectionId', wrongSelectionId);
  nextBtn.classList.add('hide');
  currentScore = score;
  quizData.currentScore = score;
  if (oldScore < currentScore) {
    oldScore = currentScore;
    localStorage.setItem('oldScore', oldScore);
  }
  btnClickCount = 1;
  score = 0;
  quizData.score = score;
  quizData.btnCount = btnClickCount;
  localStorage.setItem('quizData', JSON.stringify(quizData));
  scoreBarCorrect.style.width = 0;

  resetOptions();
  quesNo.innerText = `${btnClickCount} / ${questionLength}`;
  quizData.quesNo = quesNo.innerText;
  localStorage.setItem('quizData', JSON.stringify(quizData));
  container.classList.remove('show-result');
  container.classList.add('quiz-started');
  body.classList.remove('quiz-bgColor3');
  body.classList.add('quiz-bgColor1');

  localStorage.setItem('bodyClass', body.classList.value);
  localStorage.setItem('containerClass', container.classList.value);

  setQuestion();
});

logo.addEventListener('click', () => {
  goHome();
});
resultLogo.addEventListener('click', () => {
  goHome();
});

function goHome() {
  if(muteIntro.classList.contains('hide')){
    introMusic.currentTime = 0;
  introMusic.play();
  }
  countDownMusic.currentTime = 0;
  countDownMusic.pause();
  correctAnswerMusic.pause();
  wrongAnswerMusic.pause();
  correctAnswerMusic.currentTime = 0;
  wrongAnswerMusic.currentTime = 0;

  localStorage.setItem('optionsDisabled', 'false');
  wrongSelectionId = '';
  localStorage.setItem('wrongSelectionId', wrongSelectionId);
  currentScore = score;
  quizData.currentScore = score;
  localStorage.setItem('quizData', JSON.stringify(quizData));

  clearInterval(intervalId);
  body.classList.remove('quiz-bgColor1');
  body.classList.remove('quiz-bgColor2');
  body.classList.remove('quiz-bgColor3');
  container.classList.remove('show-result');
  container.classList.remove('quiz-started');
  main.classList.remove('hide');
  localStorage.setItem('bodyClass', body.classList.value);
  localStorage.setItem('containerClass', container.classList.value);
  localStorage.setItem('mainClass', main.classList.value);

  btnClickCount = 0;
  score = 0;
  quizData.btnCount = btnClickCount;
  quizData.score = score;
  localStorage.setItem('quizData', JSON.stringify(quizData));
  scoreBarCorrect.style.width = 0;
  quesNo.innerText = `${btnClickCount} / ${questionLength}`;
  quizData.quesNo = quesNo.innerText;
  localStorage.setItem('quizData', JSON.stringify(quizData));
  resetOptions();
  resetAll();

  if (oldScore < currentScore) {
    oldScore = currentScore;
    localStorage.setItem('oldScore', oldScore);
  }
  highestScoreEl.classList.remove('hide');
  highestScoreEl.firstElementChild.innerText = `${oldScore}/${questionLength}`;
  localStorage.setItem('highestScoreClass', highestScoreEl.classList.value);
  localStorage.setItem(
    'highestScoreText',
    highestScoreEl.firstElementChild.innerText
  );
}

function setQuestion() {
  //  debugger
  questionField.innerText = Object.keys(questions)[btnClickCount - 1];
  correctAns = Object.values(questions)[btnClickCount - 1];

  localStorage.setItem('questionFieldValue', questionField.innerText);
  localStorage.setItem('correctAns', correctAns);
  setOptions();
  startTimer();
}

function setOptions() {
  const optArr = [];
  options.forEach((option, i) => {
    const allOptKeys = Object.keys(allOptions);
    const allValuesOfOpt = Object.values(
      allOptions[allOptKeys[btnClickCount - 1]]
    )[i];
    option.innerText = allValuesOfOpt;
    optArr.push(allValuesOfOpt);
  });

  localStorage.setItem('savedOption', JSON.stringify(optArr));
}

options.forEach((option) => {
  option.addEventListener('click', (e) => {
    countDownMusic.currentTime = 0;
    countDownMusic.pause();
    nextBtn.classList.remove('hide');
    clearInterval(intervalId);
    option.parentElement.style.cursor = 'not-allowed';
    localStorage.setItem('ulCursorStyle', 'not-allowed');
    options.forEach((li) => {
      li.classList.add('disable-options');
    });
    localStorage.setItem('optionsDisabled', 'true');
    e.target.style.opacity = '100%';
    selectedId = e.target.id;

    localStorage.setItem('selectedId', selectedId);
    localStorage.setItem('selectedOptOpacity', '100%');
    if (e.target.innerText.trim() === correctAns.trim()) {
      score++;
      quizData.score = score;
      localStorage.setItem('quizData', JSON.stringify(quizData));
      e.target.style.border = '2px solid green';
      correctAnswerMusic.play();
    } else {
      wrongAnswerMusic.play();
      showCorrectOpt();
      e.target.style.border = '2px solid red';
      localStorage.setItem('wrongSelectionId', e.target.id);
    }
  });
});

function showCorrectOpt() {
  options.forEach((option) => {
    if (option.innerText.trim() === correctAns.trim()) {
      option.style.border = '2px solid green';
      option.style.opacity = '100%';
    }
  });
}

function resetOptions() {
  [...options][0].parentElement.style.cursor = 'auto';
  localStorage.setItem('ulCursorStyle', 'auto');

  options.forEach((li) => {
    li.style.opacity = '';
    li.style.border = '0.5px solid #D9D9D9';
    li.classList.remove('disable-options');
  });
}

function showScoreBar() {
  if (score / questionLength === 1) {
    scoreBarCorrect.style.width = `${(score / questionLength) * 100}%`;
    scoreBarCorrect.style['border-top-right-radius'] = '0.5rem';
    scoreBarCorrect.style['border-bottom-right-radius'] = '0.5rem';
  } else {
    scoreBarCorrect.style.width = `${(score / questionLength) * 100}%`;
  }
}

function showRemarks() {
  if (score / questionLength < 0.33) {
    resultMsg.innerText = resultRemarks[0];
    localStorage.setItem('remarks', resultMsg.innerText);
  } else if (score / questionLength > 0.33 && score / questionLength < 0.66) {
    resultMsg.innerText = resultRemarks[1];
    localStorage.setItem('remarks', resultMsg.innerText);
  } else if (score / questionLength > 0.66) {
    resultMsg.innerText = resultRemarks[2];
    localStorage.setItem('remarks', resultMsg.innerText);
  }
}

function startTimer() {
  clearInterval(intervalId);
  body.classList.remove('quiz-bgColor3');
  body.classList.remove('quiz-bgColor2');
  nextBtn.classList.add('hide');
  body.classList.add('quiz-bgColor1');

  let timeLeft = totalTimeInSec;
  timer.innerText = timeLeft;
  intervalId = setInterval(() => {
    timeLeft--;
    timer.innerText = timeLeft;

    if (timeLeft <= 0) {
      nextBtn.classList.remove('hide');
      clearInterval(intervalId);
      [...options][0].parentElement.style.cursor = 'not-allowed';
      localStorage.setItem('ulCursorStyle', 'not-allowed');

      options.forEach((li) => {
        li.classList.add('disable-options');
      });
      localStorage.setItem('optionsDisabled', 'true');

      showCorrectOpt();
    } else {
      if (totalTimeInSec / 2 >= timeLeft && timeLeft > totalTimeInSec / 4) {
        body.classList.remove('quiz-bgColor1');
        body.classList.add('quiz-bgColor2');
      } else if (totalTimeInSec / 4 >= timeLeft && timeLeft > 0) {
        body.classList.remove('quiz-bgColor2');
        body.classList.add('quiz-bgColor3');
      }
    }
  }, 1000);
  localStorage.setItem('intervalId', intervalId);
}

function resetAll() {
  bodyClass = '';
  localStorage.setItem('bodyClass', bodyClass);
  correctAns = '';
  localStorage.setItem('correctAns', correctAns);
  intervalId = '';
  localStorage.setItem('intervalId', intervalId);
  mainClass = '';
  localStorage.setItem('mainClass', mainClass);
  questionField.innerText = '';
  localStorage.setItem('questionFieldValue', questionField.innerText);
  quizData = {};
  localStorage.setItem('quizData', JSON.stringify(quizData));
  optArr = [];
  localStorage.setItem('savedOption', JSON.stringify(optArr));
  selectedId = '';
  localStorage.setItem('selectedId', selectedId);
  localStorage.setItem('selectedOptOpacity', '');
  ulCursorStyle = '';
  localStorage.setItem('ulCursorStyle', ulCursorStyle);
}

// Prevent Right Click*********************************************************

document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});
