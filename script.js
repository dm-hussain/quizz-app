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
const highestScoreEl = document.querySelector('#highest-score');

let highestScore;
let prevScore;
let score = 0;
let intervalId;

let totalTimeInSec = 30;

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
  '7. Which operator is used to assign a value to a variable? ': ':=',
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

let questionLength = Object.keys(questions).length;
scoreBarCorrect.style.width = `${(score / questionLength) * 100}%`;
scoreText.innerText = `${score} / ${questionLength}`;
let btnClickCount = 0;

startBtn.addEventListener('click', () => {
  btnClickCount++;
  body.classList.add('quiz-bgColor1');
  container.classList.add('quiz-started');
  main.classList.add('hide');
  quesNo.innerText = `${btnClickCount} / ${questionLength}`;
  setQuestion();
});

nextBtn.addEventListener('click', () => {
  btnClickCount++;
  resetOptions();

  if (btnClickCount > questionLength) {
    scoreText.innerText = `${score} / ${questionLength}`;
    container.classList.remove('quiz-started');
    container.classList.add('show-result');
    showRemarks();
    showScoreBar();
  } else {
    quesNo.innerText = `${btnClickCount} / ${questionLength}`;
    setQuestion();
  }
});

reTryBtn.addEventListener('click', () => {
  prevScore = score;
  btnClickCount = 1;
  score = 0;
  scoreBarCorrect.style.width = 0;

  resetOptions();
  quesNo.innerText = `${btnClickCount} / ${questionLength}`;
  container.classList.remove('show-result');
  container.classList.add('quiz-started');
  body.classList.remove('quiz-bgColor3');
  body.classList.add('quiz-bgColor1');
  setQuestion();
});

logo.addEventListener('click', () => {
  goHome();
});
resultLogo.addEventListener('click', () => {
  goHome();
});

function goHome() {
  prevScore = score;
  clearInterval(intervalId);
  highestScoreEl.classList.remove('hide');
  highestScoreEl.innerText = `Previous Score: ${prevScore}/${questionLength}`;
  body.classList.remove('quiz-bgColor1');
  container.classList.remove('show-result');
  container.classList.remove('quiz-started');
  main.classList.remove('hide');
  btnClickCount = 0;
  score = 0;
  scoreBarCorrect.style.width = 0;
  quesNo.innerText = `${btnClickCount} / ${questionLength}`;
  resetOptions();
}
let correctAns;
function setQuestion() {
  //  debugger
  questionField.innerText = Object.keys(questions)[btnClickCount - 1];
  correctAns = Object.values(questions)[btnClickCount - 1];

  setOptions();
  startTimer();
}

function setOptions() {
  options.forEach((option, i) => {
    const allOptKeys = Object.keys(allOptions);
    const allValuesOfOpt = Object.values(
      allOptions[allOptKeys[btnClickCount - 1]]
    )[i];
    option.innerText = allValuesOfOpt;
  });
}

options.forEach((option) => {
  option.addEventListener('click', (e) => {
    clearInterval(intervalId);

    // debugger
    options.forEach((li) => {
      li.classList.add('disable-options');
    });
    if (e.target.innerText.trim() === correctAns.trim()) {
      score++;

      e.target.style.border = '2px solid green';
    } else {
      showCorrectOpt();
      e.target.style.border = '2px solid red';
    }
  });
});

function showCorrectOpt() {
  options.forEach((option) => {
    // debugger
    if (option.innerText.trim() === correctAns.trim()) {
      option.style.border = '2px solid green';
    }
  });
}

function resetOptions() {
  options.forEach((li) => {
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
  } else if (score / questionLength > 0.33 && score / questionLength < 0.66) {
    resultMsg.innerText = resultRemarks[1];
  } else if (score / questionLength > 0.66) {
    resultMsg.innerText = resultRemarks[2];
  }
}

function startTimer() {
  clearInterval(intervalId);
  body.classList.remove('quiz-bgColor3');
  body.classList.remove('quiz-bgColor2');

  body.classList.add('quiz-bgColor1');

  let timeLeft = totalTimeInSec;
  timer.innerText = timeLeft;
  intervalId = setInterval(() => {
    timeLeft--;
    timer.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
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
}
