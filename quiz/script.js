let questionNum = 0;
let quiz;
let isAnswered = false;

function GetQuestions() {
    let txt = sessionStorage.getItem('quiz');
    txt = txt.replace('json','');
    txt = txt.replaceAll("```","");
    quiz = JSON.parse(txt);
    console.log(quiz);
    DrawQuiz();
}

function DrawQuiz() {
    let qs = quiz.questions[questionNum];
    document.getElementById("Question").innerHTML = qs.question;
    isAnswered = false;
    
    document.getElementById("feedback").style.display = "none";
    document.getElementById("feedback").className = "feedback-message";
    
    document.getElementById("mcqdiv").style.display = "none";
    document.getElementById("tfdiv").style.display = "none";
    document.getElementById("fibdiv").style.display = "none";
    
    if(qs.type === "mcq") {
        document.getElementById("mcqdiv").style.display = "grid";
        let options = document.getElementsByClassName("mcq_op");
        for(let i = 0; i < 4; i++) {
            options[i].innerHTML = qs.options[i];
            options[i].addEventListener("click", () => {
                if(!isAnswered) {
                    handleMCQAnswer(i, qs);
                }
            });
        }
    }
    
    if(qs.type === "true_false") {
        document.getElementById("tfdiv").style.display = "inline";
        let options = Array.from(document.getElementsByClassName("tf_op"));
        options.forEach(element => {
            element.addEventListener("click", () => {
                if(!isAnswered) {
                    handleTrueFalseAnswer(element, qs);
                }
            });
        });
    }
    
    if(qs.type === "fill_in_blank") {
        document.getElementById("fibdiv").style.display = "inline";
        document.getElementById("fib_op").addEventListener("keypress", (event) => {
            if(event.key === "Enter" && !isAnswered) {
                handleFillInBlankAnswer(event.target.value, qs);
            }
        });
    }
}

function handleMCQAnswer(selectedIndex, question) {
    isAnswered = true;
    let options = document.getElementsByClassName("mcq_op");
    let isCorrect = question.options[selectedIndex] === question.answer;


    let userAns = sessionStorage.getItem("useranswer") || "";
    userAns +=question.options[selectedIndex]+"#@#";
    sessionStorage.setItem("useranswer",userAns);


    for(let i = 0; i < options.length; i++) {
        options[i].classList.add("disabled");
    }
    
    for(let i = 0; i < options.length; i++) {
        if(question.options[i] === question.answer) {
            options[i].classList.add("correct");
        }
    }

    if(!isCorrect) {
        options[selectedIndex].classList.add("incorrect");
    }
    
    showFeedback(isCorrect, question.answer);

}

function handleTrueFalseAnswer(selectedElement, question) {
    isAnswered = true;
    let options = Array.from(document.getElementsByClassName("tf_op"));
    let isCorrect = selectedElement.value === question.answer.toString();

    let userAns = sessionStorage.getItem("useranswer") || "";
    userAns +=selectedElement.value +"#@#";
    sessionStorage.setItem("useranswer",userAns);
    
    options.forEach(option => {
        option.classList.add("disabled");
    });
    options.forEach(option => {
        if(option.value === question.answer.toString()) {
            option.classList.add("correct");
        }
    });
    if(!isCorrect) {
        selectedElement.classList.add("incorrect");
    }
    
    showFeedback(isCorrect, question.answer);
}

function handleFillInBlankAnswer(userAnswer, question) {
    isAnswered = true;
    let input = document.getElementById("fib_op");
    let isCorrect = userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();

    let userAns = sessionStorage.getItem("useranswer") || "";
    userAns += userAnswer.toLowerCase().trim() +"#@#";
    sessionStorage.setItem("useranswer",userAns);

    input.classList.add("disabled");
    input.disabled = true;
    
    if(isCorrect) {
        input.classList.add("correct");
    } else {
        input.classList.add("incorrect");
    }
    
    showFeedback(isCorrect, question.answer);
}

function showFeedback(isCorrect, correctAnswer) {
    let feedback = document.getElementById("feedback");
    
    if(isCorrect) {
        feedback.innerHTML = "✅ Correct! Well done!";
        feedback.classList.add("correct");
    } else {
        feedback.innerHTML = `❌ Incorrect. The correct answer is: ${correctAnswer}`;
        feedback.classList.add("incorrect");
    }
    
    feedback.style.display = "block";
}

function OnClickNext() {
    if(questionNum < quiz.questions.length - 1) {
        questionNum++;
        RemoveEventListeners();
        DrawQuiz();
    } else {
        window.location.href = "/Sem2_Ui_Project/quiz_view/index.html";
    }
}

function RemoveEventListeners() {
    let options = document.getElementsByClassName("mcq_op");
    for(let i = 0; i < options.length; i++) {
        let oldOption = options[i];
        let newOption = oldOption.cloneNode(true);
        newOption.className = "mcq_op";
        oldOption.parentNode.replaceChild(newOption, oldOption);
    }
    
    options = document.getElementsByClassName("tf_op");
    for(let i = 0; i < options.length; i++) {
        let oldOption = options[i];
        let newOption = oldOption.cloneNode(true);
        newOption.className = "tf_op";
        oldOption.parentNode.replaceChild(newOption, oldOption);
    }
    
    let oldFibOp = document.getElementById("fib_op");
    oldFibOp.value = "";
    let newFibOp = oldFibOp.cloneNode(true);
    newFibOp.className = "";
    newFibOp.disabled = false;
    oldFibOp.parentNode.replaceChild(newFibOp, oldFibOp);
}

function OnClickBack() {
    if(questionNum > 0) {
        questionNum--;
        RemoveEventListeners();
        DrawQuiz();
    }
}

GetQuestions();