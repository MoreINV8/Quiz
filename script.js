const quizQuestion = document.querySelector(".question h3");
const choiceField = document.getElementById("answer");
const nextBtn = document.getElementById("nextBtn");

nextBtn.addEventListener("click", moveNext);

let score = 0;
let questionIndex = 0;
let maxQuestion;

async function loadQuestion() {
    const json = await fetch("./quiz.json");
    const data = await json.json();
    maxQuestion = await data.length;
    return data;
}

async function startQuiz() {
    score = 0;
    questionIndex = 0;
    await showQuestion();
}

function clear() {
    while (choiceField.firstChild) {
        choiceField.removeChild(choiceField.firstChild);
    }
    nextBtn.style.display = "none";
}

async function showQuestion() {
    clear();
    const question = await loadQuestion();
    quizQuestion.innerHTML = `${questionIndex + 1}. ${question[questionIndex].question}`;

    const choices = question[questionIndex].answer;
    choices.forEach(choice => {
        const answer = document.createElement("button");
        answer.innerHTML = choice.data;
        answer.dataset.status = choice.status;
        answer.classList.add("btn");
        answer.addEventListener("click", choseAnswer);

        choiceField.appendChild(answer);
    });
}

function choseAnswer(e) {
    let isWrong = false;
    const chosen = e.target;
    const buttons = choiceField.children;
    // can be get item by Array.from(choiceField.children)

    if (chosen.dataset.status === "true") {
        chosen.classList.add("correct");
        score++;
    } else {
        chosen.classList.add("wrong");
        isWrong = true;
    }

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons.item(i);
        if (isWrong && button.dataset.status === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    }

    nextBtn.style.display = "block";
}

function moveNext() {
    questionIndex++;
    if (questionIndex < maxQuestion) {
        showQuestion();
    } else if (questionIndex === maxQuestion) {
        clear();
        quizQuestion.innerHTML = `You have got ${score} out of ${maxQuestion}!`;
        nextBtn.innerHTML = "Try Again";
        nextBtn.style.display = "block";
    } else {
        startQuiz();
    }
}

startQuiz();