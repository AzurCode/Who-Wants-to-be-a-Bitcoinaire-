const startButton = document.getElementById("play");
const nextButton = document.getElementById("next-btn");
const exitButton = document.getElementById("exit-btn");
const restartButton = document.getElementById("restart-btn");
const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer");
const startElement = document.getElementById("start-page");
const gameElement = document.getElementById("play-game");
const endElement = document.getElementById("game-end");
const winnings = document.getElementById("winning-section");
const child = document.getElementById("show-winnings");
const alert = document.getElementById("alert");
const fiftyButton = document.getElementById("fifty");
const phoneButton = document.getElementById("phone");
const audienceButton = document.getElementById("audience");
const audienceVoters = document.getElementById("audience-vote");

const finalScoreEl = document.getElementById("finalScore");
const highscoreContainer = document.getElementById("highscoreContainer");
const highscoreDiv = document.getElementById("high-scorePage");
const highscoreInputName = document.getElementById("initials");
const highscoreDisplayName = document.getElementById("highscore-initials");

const submitScoreBtn = document.getElementById("submitScore");
const highscoreDisplayScore = document.getElementById("highscore-score");
const highscoreDisplayDate = document.getElementById("highscore-date");
const highscoreDisplaySession = document.getElementById("highscore-session");

let shuffledQuestions, currentQuestionIndex, currentWinningIndex;
let winningMessage;
let score = 0;
let temp = 1;
var items = [0, 10, 20, 30, 40];

startButton.addEventListener("click", startGame);

(function ($) {
  $.rand = function (arg) {
    if ($.isArray(arg)) {
      return arg[$.rand(arg.length)];
    } else if (typeof arg == "number") {
      return Math.floor(Math.random() * arg);
    } else {
      return 4; // selezione la prima domanda dell'array question di difficolta 1
    }
  };
})(jQuery);

function join(t, a, s) {
  function format(m) {
     let f = new Intl.DateTimeFormat('en', m);
     return f.format(t);
  }
  return a.map(format).join(s);
}

let a = [{day: 'numeric'}, {month: 'short'}, {year: 'numeric'}];
let s = join(new Date, a, '-'); // ricavo la data del giorno

function startGame() {
  var audio = new Audio("/sounds/play.mp3");
  audio.play();
   var d = new Date();
  startTime = d.getTime();
  for (let i = 0; i < 10; i++) {
    /*Remove any classlist indicating colors on the winnings*/
    winnings.children[i].classList.remove("correctly");
    winnings.children[i].classList.remove("wrongly");
  }
  startElement.classList.add("hide");
  gameElement.classList.remove("hide");
  endElement.classList.add("hide");
  highscoreContainer.classList.add("hide");
  generateQuestion();
}

function generateQuestion() {
 
  nextButton.classList.remove("hide");
  exitButton.classList.remove("hide");
  currentQuestionIndex = $.rand(items);
  currentWinningIndex = 9;
  
  showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerHTML = question.question;
  question.answers.forEach((answer) => {
    const newButton = document.createElement(
      "button"
    ); /*create a new button elements for the answers*/
    newButton.classList.add("btn");
    newButton.innerHTML = answer.text;
    if (answer.correct) {
      newButton.dataset.correct =
        answer.correct; /*check if the answer is right or wrong */
    }
    answerButtonsElement.appendChild(newButton);
    newButton.addEventListener("click", checkAnswer);
  });
}

function checkAnswer(ans) {
  const selectedButton = ans.target;
  const answer =
    selectedButton.dataset
      .correct; /*Chechinkg if the answer is right or wrong using data attributes*/
  const totalWinnings = document.createElement(
    "div"
  ); /*create a new elements to represent total winnings for the answers*/

  if (answer && score < 11) {
    /*Chech if the answer is correct or wrong and if there are still questions unanswered*/
    var audio = new Audio("/sounds/sound_right.mp3");
    audio.play();
    nxtqst = true;
    selectedButton.classList.add("correct");
    winnings.children[currentWinningIndex].classList.add("correctly");
    score++;
    // setTimeout(nextquestion, 1000)
  } else if (!answer) {
    var audio = new Audio("/sounds/sound_wrong.mp3");
    audio.play();
    selectedButton.classList.add("wrong");
    winnings.children[currentWinningIndex].classList.add("wrongly");
    //Looping through the answers button

    Array.from(answerButtonsElement.children).forEach((button) => {
      setStatusClass(button, button.dataset.correct);
    });
    /*Create a winning Message at the end of the game with the amount won*/

    if (score < 10) {
      winningMessage = document.createTextNode(
        `Mi dispiace vai a casa con 0 btc. Il nulla!! Ritenta la prossima volta`
      );
    } else {
      winningMessage = document.createTextNode("");
    }
    totalWinnings.appendChild(winningMessage);
    endElement.insertBefore(totalWinnings, child);
    setTimeout(gameOver, 1000);
  } else {
    selectedButton.classList.add("correct");
    winnings.children[currentWinningIndex].classList.add("correctly");
    setTimeout(gameOver, 1000);
  }
  if (score === 10) {
    winningMessage = document.createTextNode(
      `Congratulazioni, hai risposto correttamente a tutte le domande! Vai a casa con ben 512 btc!!!`
    );
    totalWinnings.appendChild(winningMessage);
    endElement.insertBefore(totalWinnings, child);
    setTimeout(gameOver, 1000);
  }
}

function setStatusClass(element, correct) {
  // clearStatusClass(element)
  if (correct) {
    element.classList.add("correct");
  }
}

exitButton.addEventListener("click", exitGame);
function exitGame() {
  const totalWinnings = document.createElement("div");
  if (score === 0) {
    winningMessage = document.createTextNode(
      `Mi dispiace vai a casa con 0 btc. Il nulla!! Ritenta la prossima volta`
    );
    totalWinnings.appendChild(winningMessage);
    endElement.insertBefore(totalWinnings, child);
    setTimeout(gameOver, 1000);
  }
  if (score < 10 && score > 1) {
    temp = Math.pow(2, score);
    winningMessage = document.createTextNode(
      "Hai risposto correttamente a " +
        score +
        " risposte! Vai a casa con " +
        temp +
        " btc"
    );
    totalWinnings.appendChild(winningMessage);
    endElement.insertBefore(totalWinnings, child);
    setTimeout(gameOver, 1000);
  } else if (score == 1) {
    temp = 1;
    winningMessage = document.createTextNode(
      "Hai risposto correttamente a " +
        score +
        " risposta! Vai a casa con " +
        temp +
        " btc"
    );
    totalWinnings.appendChild(winningMessage);
    endElement.insertBefore(totalWinnings, child);
    setTimeout(gameOver, 1000);
  }
}

nextButton.addEventListener("click", nextquestion);

function nextquestion() {
  if (nxtqst == true) {
    currentQuestionIndex++;
    currentWinningIndex--;
    nxtqst = false;
    resetState();
    showQuestion(questions[currentQuestionIndex]);
  }
}

function resetState() {
  while (answerButtonsElement.firstChild) {
    /*Remove previous answers*/
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
  alert.classList.remove("show");
  audienceVoters.classList.remove("show");
}

function gameOver() {
  gameElement.classList.add("hide");
  endElement.classList.remove("hide");
  highscoreContainer.classList.add("hide");
  highscoreInputName.value = ("");
  var n = new Date();
  endTime =n.getTime();
  sessionTimeMin = Math.floor((endTime - startTime) /1000/60);
  sessionTimeSec = Math.floor((endTime - startTime) /1000);
  temp = 1;
}


restartButton.addEventListener("click", restartGame);

function restartGame() {
  score = 0;
  winningMessage.remove(); /*Remove the winning message everytime restart button is clicked so a new one can be printed at the end of the game*/
  resetState();
  fiftyButton.addEventListener("click", fiftyFifty, {
    once: true,
  }); /*So your fiftyFity lifeline can be active again*/
  phoneButton.addEventListener("click", callFriend, { once: true });
  audienceButton.addEventListener("click", askAudience, { once: true });
  fiftyButton.classList.remove("hide");
  phoneButton.classList.remove("hide");
  audienceButton.classList.remove("hide");
  startGame();
}

function checkWinnings() {
  for (let i = winnings.children.length - 1; i >= 0; i--) {
    winnings.children[i].classList.add("correct");
  }
}

//LifeLines

fiftyButton.addEventListener("click", fiftyFifty, { once: true });
phoneButton.addEventListener("click", callFriend, { once: true });
audienceButton.addEventListener("click", askAudience, { once: true });

function fiftyFifty() {
  var audio = new Audio("/sounds/50-50.mp3");
  audio.play();
  let rand = Math.floor(Math.random() * 3);
  let newArr = []; //Create a new array to push 2 wrongs options into
  audienceVoters.classList.remove("show");
  alert.classList.remove("show");
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      if (
        !answerButtonsElement.children[j].dataset.correct &&
        newArr.length < 2
      ) {
        newArr.push(answerButtonsElement.children[j]);
      }
    }
  }
  for (let i = 0; i < newArr.length; i++) {
    newArr[i].classList.add("nothing");
  }
  fiftyButton.classList.add("hide");
}

function callFriend() {
  var audio = new Audio("/sounds/help.mp3");
  audio.play();
  audienceVoters.classList.remove("show");
  alert.classList.add("show");
  for (let i = 0; i < 4; i++) {
    if (answerButtonsElement.children[i].dataset.correct) {
      answer = answerButtonsElement.children[i].innerText;
      //create an array of possible answer and generate a random one
      friendsAnswer = [
        `Ma hai letto bene la domanda? \n Veramente mi chiami per una domanda del genere?\n La risposta è sicuramente ${answer}`,
        `Molto probabilmente la risposta è ${answer}`,
        `Questa la so! La risposta è ${answer}`,
        `Sono indeciso forse è ${answer}`,
      ];
      alert.innerHTML =
        friendsAnswer[Math.floor(Math.random() * friendsAnswer.length)];
    }
  }
  phoneButton.classList.add("hide");
}

function askAudience() {
  var audio = new Audio("/sounds/help.mp3");
  audio.play();
  alert.classList.remove("show");
  audienceVoters.classList.add("show");
  let A = document.getElementById("a");
  let B = document.getElementById("b");
  let C = document.getElementById("c");
  let D = document.getElementById("d");
  let correctHeight = ["150px", "120px", "165px", "110px", "145px"]; //Create an array of height so you can have a random value
  let wrongHeight = [
    "30px",
    "20px",
    "90px",
    "45px",
    "80px",
    "25px",
    "40px",
    "100px",
    "85px",
    "55px",
    "43px",
  ];

  if (answerButtonsElement.children[0].dataset.correct) {
    A.style.height =
      correctHeight[Math.floor(Math.random() * correctHeight.length)];
    B.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
    C.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
    D.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
  } else if (answerButtonsElement.children[1].dataset.correct) {
    A.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
    B.style.height =
      correctHeight[Math.floor(Math.random() * correctHeight.length)];
    C.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
    D.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
  } else if (answerButtonsElement.children[2].dataset.correct) {
    A.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
    B.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
    C.style.height =
      correctHeight[Math.floor(Math.random() * correctHeight.length)];
    D.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
  } else if (answerButtonsElement.children[3].dataset.correct) {
    A.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
    B.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
    C.style.height =
      wrongHeight[Math.floor(Math.random() * wrongHeight.length)];
    D.style.height =
      correctHeight[Math.floor(Math.random() * correctHeight.length)];
  }
  audienceButton.classList.add("hide");
}

submitScoreBtn.addEventListener("click", highscore);
function highscore() {
  if (highscoreInputName.value === "") {
    alert("Initials cannot be blank");
    return false;
  } else {
    var savedHighscores =
      JSON.parse(localStorage.getItem("savedHighscores")) || [];
    var currentUser = highscoreInputName.value.trim(); 
    var currentHighscore = {
      name: currentUser,
      score: score +' pts',
      date : join(new Date, a, '-'),
      session : sessionTimeMin + 'min' + ' '+ sessionTimeSec + 's'
    };

    highscoreContainer.style.display = "flex";
    highscoreDiv.style.display = "block";

    savedHighscores.push(currentHighscore);
    localStorage.setItem("savedHighscores", JSON.stringify(savedHighscores));
    generateHighscores();
  }
  endElement.classList.add("hide");
}
//
function generateHighscores() {
  highscoreDisplayName.innerHTML = "";
  highscoreDisplayScore.innerHTML = "";
  highscoreDisplayDate.innerHTML = "";
  highscoreDisplaySession.innerHTML = "";
  var highscores = JSON.parse(localStorage.getItem("savedHighscores")) || [];
  for (i = 0; i < highscores.length; i++) {
    var newNameSpan = document.createElement("ul");
    var newScoreSpan = document.createElement("ul");
    var newDateSpan = document.createElement("ul");
    var newDateSession = document.createElement("ul");
    newNameSpan.textContent = highscores[i].name;
    newScoreSpan.textContent = highscores[i].score;
    newDateSpan.textContent = highscores[i].date;
    newDateSession.textContent = highscores[i].session;
    highscoreDisplayName.appendChild(newNameSpan);
    highscoreDisplayScore.appendChild(newScoreSpan);
    highscoreDisplayDate.appendChild(newDateSpan);
    highscoreDisplaySession.appendChild(newDateSession);
  }
}

//
function showHighscore() {
  endElement.classList.add("hide");
  startElement.classList.add("hide");
  highscoreContainer.style.display = "flex";
  highscoreDiv.style.display = "block";
  generateHighscores();
}

//
function clearScore() {
  window.localStorage.clear();
  highscoreDisplayName.textContent = "";
  highscoreDisplayScore.textContent = "";
  highscoreDisplayDate.textContent = "";
  highscoreDisplaySession.textContent = "";
}

const questions = [
  { dif:1,
    question: "Quanti sono i giocatori titolari di una squadra rugby?",
    answers: [
      { text: "A.  15", correct: true },
      { text: "B.  11", correct: false },
      { text: "C.  12", correct: false },
      { text: "D.  8", correct: false },
    ],
  },
  { dif:2,
    question: "Da quale oceano è bagnata Cuba?",
    answers: [
      { text: "A.  Nessuno", correct: false },
      { text: "B.  Pacifico", correct: false },
      { text: "C.  Indiano", correct: false },
      { text: "D.  Atlantico", correct: true },
    ],
  },
  { dif:3,
    question: "Quale giorno è festa nazionale in USA?",
    answers: [
      { text: "A.  4 Agosto", correct: false },
      { text: "B.  4 Luglio", correct: true },
      { text: "C.  11 Settembre", correct: false },
      { text: "D.  Non c é una festa nazionale", correct: false },
    ],
  },
  {
    question: "Quanti punti bisogna fare per vincere un set di Ping Pong?",
    answers: [
      { text: "A.  11", correct: true },
      { text: "B.  21", correct: false },
      { text: "C.  9", correct: false },
      { text: "D.  16", correct: false },
    ],
  },
  { dif:4,
    question: "Chi è l inventore di FaceBook?",
    answers: [
      { text: "A.  Lino Banfi", correct: false },
      { text: "B.  Elon Musk", correct: false },
      { text: "C.  Mark Elliot Zuckerberg", correct: true },
      { text: "D.  Bill Gates", correct: false },
    ],
  },
  { dif:5,
    question: "Chi scrisse “L’Iliade” e “L’Odissea”?",
    answers: [
      { text: "A.  Virgilio", correct: false },
      { text: "B.  Omero", correct: true },
      { text: "C.  Dante Alighieri", correct: false },
      { text: "D.  Giovanni Boccaccio", correct: false },
    ],
  },
  { dif:6,
    question: "In quale Museo si trova “ La Gioconda” di Leonardo Da Vinci?",
    answers: [
      { text: "A.  Louvre", correct: true },
      { text: "B.  Uffizzi", correct: false },
      { text: "C.  Boston Museum", correct: false },
      { text: "D.  British Museum", correct: false },
    ],
  },
  { dif:7,
    question: "Quale festa è riconosciuta dagli americani come “Turkey Day”?",
    answers: [
      { text: "A.  Giorno del Ringraziamento", correct: true },
      { text: "B.  Festa del Ringraziamento", correct: false },
      { text: "C.  Pasqua", correct: false },
      { text: "D.  Natale", correct: false },
    ],
  },
  { dif:8,
    question:
      "Chi ha interpretato il personaggio di Jack Torrance nel film “The Shining”?",
    answers: [
      { text: "A.  Al Pacino", correct: false },
      { text: "B.  Robert De Niro", correct: false },
      { text: "C.  Morgan Freeman", correct: false },
      { text: "D.  Jack Nicholson", correct: true },
    ],
  },
  { dif:9,
    question: "Qual è il nome del mostro del lago di Lockness?",
    answers: [
      { text: "A.  Patty", correct: false },
      { text: "B.  Dolly", correct: false },
      { text: "C.  Nessy", correct: true },
      { text: "D.  Maggie", correct: false },
    ],
  },
  { dif:10,
    question:
      "Quale fu il primo calciatore italiano a vincere la scarpa d’oro?",
    answers: [
      { text: "A.  Luca Toni", correct: true },
      { text: "B.  Franceso Totti", correct: false },
      { text: "C.  Pippo Inzaghi", correct: false },
      { text: "D.  Christian Vieri", correct: false },
    ],
  },
  { dif:1,
    question: "Quanti game bisogna vincere nel tennis per aggiudicarsi un set?",
    answers: [
      { text: "A.  4", correct: false },
      { text: "B.  5", correct: false },
      { text: "C.  6", correct: true },
      { text: "D.  3", correct: false },
    ],
  },
  { dif:2,
    question:
      "Quale astronomo nel 1543 pubblicò la teoria del sole al centro dell’universo?",
    answers: [
      { text: "A.  Galileo Galilei", correct: false },
      { text: "B. Niccolò Copernico", correct: true },
      { text: "C.  Tolomeo", correct: false },
      { text: "D.  Giovanni Keplero", correct: false },
    ],
  },
  { dif:3,
    question:
      "Come si chiamava il portatore dell’anello nel film “Lord of the rings”?",
    answers: [
      { text: "A.  Frodo Baggins", correct: true },
      { text: "B.  Bilbo Baggins", correct: false },
      { text: "C.  Meriadoc Brandibuck", correct: false },
      { text: "D.  Samwise Gangee", correct: false },
    ],
  },
  { dif:4,
    question: "La Claustrophobia è la paura di cosa?",
    answers: [
      { text: "A.  Santa Claus", correct: false },
      { text: "B.  Stranieri", correct: false },
      { text: "C.  Animali", correct: false },
      { text: "D.  Spazi chiusi", correct: true },
    ],
  },
  { dif:5,
    question: "Dove è Morto Napoleone Bonaparte?",
    answers: [
      { text: "A.  Sant Elena", correct: true },
      { text: "B.  Waterloo", correct: false },
      { text: "C.  Nantes", correct: false },
      { text: "D.  Isola d’elba", correct: false },
    ],
  },
  { dif:6,
    question: "In quale altro nome sono chiamati i globuli bianchi?",
    answers: [
      { text: "A.  Piastrine", correct: false },
      { text: "B.  Leucociti", correct: true },
      { text: "C.  Linfociti", correct: false },
      { text: "D.  Plasma", correct: false },
    ],
  },
  { dif:7,
    question: "Quale giorno è festa nazionale in Francia?",
    answers: [
      { text: "A.  14 Luglio", correct: true },
      { text: "B.  14 Dicembre", correct: false },
      { text: "C.  4 Gennaio", correct: false },
      { text: "D.  4 Luglio", correct: false },
    ],
  },
  { dif:8,
    question: "Qual è l’ultima lettera dell’alfabeto greco?",
    answers: [
      { text: "A.  Teta", correct: false },
      { text: "B.  Delta", correct: false },
      { text: "C.  Omega", correct: true },
      { text: "D.  Epsilon", correct: false },
    ],
  },
  { dif:9,
    question: "In quale organo del corpo umano si trova la ghiandola pineale?",
    answers: [
      { text: "A.  Pancreas", correct: false },
      { text: "B.  Fegato", correct: false },
      { text: "C.  Cervello", correct: true },
      { text: "D.  Rene", correct: false },
    ],
  },
  { dif:10,
    question: "Quale dinastia governò per tutto il XVI secolo in cina?",
    answers: [
      { text: "A.  Ming", correct: true },
      { text: "B.  Manchu", correct: false },
      { text: "C.  Hang", correct: false },
      { text: "D.  Wang", correct: false },
    ],
  },
  { dif:1,
    question: "Quale di questi è il titolo di un disco di Michael Jackson?",
    answers: [
      { text: "A.  Dangerous", correct: true },
      { text: "B.  Reptile", correct: false },
      { text: "C.  My lady", correct: false },
      { text: "D.  High Voltage", correct: false },
    ],
  },
  { dif:2,
    question: "Chi ha scritto “ Dr. Jekyll and Mr. Hyde”?",
    answers: [
      { text: "A.  Wilde", correct: false },
      { text: "B.  Joice", correct: false },
      { text: "C.  Hemingway", correct: false },
      { text: "D.  Stevenson", correct: true },
    ],
  },
  { dif:3,
    question: "In quale regione d’Italia si trova la provincia di Teramo ?",
    answers: [
      { text: "A.  Abruzzo", correct: true },
      { text: "B.  Umbria", correct: false },
      { text: "C.  Basilicata", correct: false },
      { text: "D.  Marche", correct: false },
    ],
  },
  { dif:4,
    question: "Se passeggi a Djakarta, in che nazione ti trovi ?",
    answers: [
      { text: "A.  Italia", correct: false },
      { text: "B.  Indonesia", correct: true },
      { text: "C.  Inghilterra", correct: false },
      { text: "D.  Kazakistan", correct: false },
    ],
  },
  { dif:5,
    question: "Quale calciatore era soprannominato “El pibe de oro”?",
    answers: [
      { text: "A.  Lionel Messi", correct: false },
      { text: "B.  Cristiano Ronaldo", correct: false },
      { text: "C.  Diego Armando Maradona", correct: true },
      { text: "D.  Pelé", correct: false },
    ],
  },
  { dif:6,
    question:
      "Quante Medaglie vinse Jesse Owens alle olimpiadi di Berlino nel 1936?",
    answers: [
      { text: "A.  4", correct: true },
      { text: "B.  3", correct: false },
      { text: "C.  5", correct: false },
      { text: "D.  6", correct: false },
    ],
  },
  { dif:7,
    question: "In quale città si trova lo stadio “Old Trafford”?",
    answers: [
      { text: "A.  Manchester", correct: true },
      { text: "B.  Liverpool", correct: false },
      { text: "C.  Londra", correct: false },
      { text: "D.  Newcastle", correct: false },
    ],
  },
  { dif:8,
    question: "In quale anno Robbie Williams ha lasciato i Take That ?",
    answers: [
      { text: "A.  1993", correct: false },
      { text: "B.  2000", correct: false },
      { text: "C.  1995", correct: true },
      { text: "D.  1997", correct: false },
    ],
  },
  { dif:9,
    question: "Chi ha vinto il “Tour de France” nel 2019?",
    answers: [
      { text: "A.  Egan Bernal", correct: true },
      { text: "B.  Alejandro Valverde", correct: false },
      { text: "C.  Mikel Landa", correct: false },
      { text: "D.  Steven Kruijswijk", correct: false },
    ],
  },
  { dif:10,
    question: "Qual è l’unica città ad estendersi su due continenti?",
    answers: [
      { text: "A.  Mosca", correct: false },
      { text: "B.  Kabul", correct: false },
      { text: "C.  Istanbul", correct: true },
      { text: "D.  San Pietroburgo", correct: false },
    ],
  },
  { dif:1,
    question:
      "Dove si sono disputati i campionati del mondo di calcio nel 1986?",
    answers: [
      { text: "A.  Messico", correct: true },
      { text: "B.  Spagna", correct: false },
      { text: "C.  Argentina", correct: false },
      { text: "D.  Germania", correct: false },
    ],
  },
  { dif:2,
    question: "Chi disse la celebre frase: “Veni,vidi,vici”?",
    answers: [
      { text: "A.  Aristotele", correct: false },
      { text: "B.  Annibale", correct: false },
      { text: "C.  Giulio Cesare", correct: true },
      { text: "D.  Carlo Magno", correct: false },
    ],
  },
  { dif:3,
    question: "In quale/i anno/i ci fu il congresso di Vienna",
    answers: [
      { text: "A.  1814", correct: false },
      { text: "B.  1814-1815", correct: true },
      { text: "C.  1817-1818", correct: false },
      { text: "D.  1813", correct: false },
    ],
  },
  { dif:4,
    question:
      "Quale tra questi film ha vinto l’Oscar come miglior film nel 1998?",
    answers: [
      { text: "A.  Titanic", correct: true },
      { text: "B.  E.T.", correct: false },
      { text: "C.  Unforgiven", correct: false },
      { text: "D.  Chicago", correct: false },
    ],
  },
  { dif:5,
    question: "Nel 1594 Shakespeare entrò in quale compagnia teatrale?",
    answers: [
      { text: "A.  Globe Theatre", correct: false},
      { text: "B.  British Theatre", correct: false },
      { text: "C.  The King’s Men", correct: false },
      { text: "D.  The Lord Chamberlain’s Men", correct: true },
    ],
  },
  { dif:6,
    question:
      "In Canada esistono due fiumi omonimi di due celebri personaggi storici...",
    answers: [
      { text: "A.  Churchill e Nelson", correct: true },
      { text: "B.  Danton e Napoleone", correct: false },
      { text: "C.  Darwin e Newton", correct: false },
      { text: "D.  Bach e Chopin", correct: false },
    ],
  },
  { dif:7,
    question: "Chi furono i fondatori di Cartagine?",
    answers: [
      { text: "A.  I fenici", correct: true },
      { text: "B.  I vichinghi", correct: false },
      { text: "C.  I romani", correct: false },
      { text: "D.  Gli egizi", correct: false },
    ],
  },
  { dif:8,
    question: "Quale nazione ha vinto la coppa del mondo di calcio nel 1978?",
    answers: [
      { text: "A.  Germania dell’ovest", correct: false },
      { text: "B.  Brasile", correct: false },
      { text: "C.  Francia", correct: false },
      { text: "D.  Argentina", correct: true },
    ],
  },
  { dif:9,
    question: "Quando Enrico Fermi inventò il reattore nucleare?",
    answers: [
      { text: "A.  1968", correct: false },
      { text: "B.  1922", correct: false },
      { text: "C.  1955", correct: false },
      { text: "D.  1942", correct: true },
    ],
  },
  { dif:10,
    question:
      "Quale paese è entrato nell’ “Act of union” insieme all’Inghilterra nel 1536",
    answers: [
      { text: "A.  Scozia", correct: false },
      { text: "B.  India", correct: false },
      { text: "C.  Galles", correct:  true },
      { text: "D.  Irlanda", correct: false },
    ],
  },
  { dif:1,
    question: "Qual è il significato della parola mongola “dalai”?",
    answers: [
      { text: "A.  Oceano", correct: true },
      { text: "B.  Sentiero", correct: false },
      { text: "C.  Volo", correct: false },
      { text: "D.  Landa", correct: false },
    ],
  },
  { dif:2,
    question: "Qual è la città più popolosa del mondo?",
    answers: [
      { text: "A.  Shangai", correct: true },
      { text: "B.  Hanoi", correct: false },
      { text: "C.  Pechino", correct: false },
      { text: "D.  New York", correct: false },
    ],
  },
  { dif:3,
    question: "La pianta montana Carlina Acaulis viene anche chiamata...",
    answers: [
      { text: "A.  Curavacca", correct: false },
      { text: "B.  Scacciafulmini", correct: false },
      { text: "C.  SegnatempoCuravacca", correct: true },
      { text: "D.  Antivalanga", correct: false },
    ],
  },
  { dif:4,
    question: "Qual era il vero nome del celebre calciatore “ Zico”?",
    answers: [
      { text: "A.  Edson Arantes do Nascimento", correct: false },
      { text: "B.  Arthur Henrique Ramos de Oliveira Melo", correct: false },
      { text: "C.  Marcelo Vieira da Silva Júnior", correct: false },
      { text: "D.  Arthur Antunes Coimbra", correct: true},
    ],
  },
  { dif:5,
    question: "Quale di questi funghi è velenoso?",
    answers: [
      { text: "A.  Porcino malefico", correct: true },
      { text: "B.  Trombetta dei morti", correct: false },
      { text: "C.  Ovulo reale", correct: false },
      { text: "D.  Mazza di tamburo", correct: false },
    ],
  },
  { dif:6,
    question:
      "In quale film di Sergio Leone non è Clint Eastwood il protagonista?",
    answers: [
      { text: "A.  C’era una volta il West", correct: false },
      { text: "B.  Per un pugno di dinamite", correct: true },
      { text: "C.  Per qualche dollaro in più", correct: false },
      { text: "D.  Il buono,il brutto,il cattivo", correct: false },
    ],
  },
  { dif:7,
    question: "Quale scrittore sudamericano vinse il premio nobel nel 1971?",
    answers: [
      { text: "A.  J. Cela", correct: false },
      { text: "B.  G. Marquez", correct: false },
      { text: "C.  P. Neruda", correct: true },
      { text: "D.  A. Soriano", correct: false },
    ],
  },
  { dif:8,
    question: "Quale di questi è un deserto australiano?",
    answers: [
      { text: "A.  Great Sandy", correct: true },
      { text: "B.  Sahara", correct: false },
      { text: "C.  Grey Rupert", correct: false },
      { text: "D.  Salt Sand", correct: false },
    ],
  },
  { dif:9,
    question: "Qual è il significato della parola mongola “dalai”?",
    answers: [
      { text: "A.  Oceano", correct: true },
      { text: "B.  Sentiero", correct: false },
      { text: "C.  Volo", correct: false },
      { text: "D.  Landa", correct: false },
    ],
  },
  { dif:10,
    question: "Quale nazione ha vinto la coppa del mondo di calcio nel 1978?",
    answers: [
      { text: "A.  Argentina", correct: true },
      { text: "B.  Brasile", correct: false },
      { text: "C.  Francia", correct: false },
      { text: "D.  Germania dell’ovest", correct: false },
    ],
  },
];




