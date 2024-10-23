let questions = [
  {
    question: "Apa itu JavaScript?",
    answers: [
      "Bahasa pemrograman",
      "Bahasa markup",
      "Bahasa query",
      "Bahasa styling",
    ],
    correct: 0,
  },
  {
    question: "Apa itu HTML?",
    answers: [
      "Bahasa pemrograman",
      "Bahasa markup",
      "Bahasa query",
      "Bahasa styling",
    ],
    correct: 1,
  },
  {
    question: "Apa itu CSS?",
    answers: [
      "Bahasa pemrograman",
      "Bahasa markup",
      "Bahasa query",
      "Bahasa styling",
    ],
    correct: 3,
  },
];

let currentQuestion = 0;
let score = 0;

document.querySelector(".question").innerText =
  questions[currentQuestion].question;
questions[currentQuestion].answers.forEach((answer, index) => {
  document.querySelector(`#answer${index + 1}`).innerText = answer;
});

document.querySelectorAll(".answer").forEach((answer) => {
  answer.addEventListener("click", (e) => {
    let correct = questions[currentQuestion].correct;
    let answerIndex = parseInt(e.target.id.replace("answer", "")) - 1;
    if (answerIndex === correct) {
      score++;
      document.querySelector(".score").innerText = `Skor: ${score} / ${
        currentQuestion + 1
      }`;
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
      document.querySelector(".question").innerText =
        questions[currentQuestion].question;
      questions[currentQuestion].answers.forEach((answer, index) => {
        document.querySelector(`#answer${index + 1}`).innerText = answer;
      });
    } else {
      document.querySelector(".question").innerText = "Quiz selesai!";
      document.querySelector(".answers").style.display = "none";
    }
  });
});
