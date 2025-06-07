let quiz;
let userAnswers = [];
let correctCount = 0;

function loadResults() {
    try {
        let quizData = sessionStorage.getItem('quiz');
        if (!quizData) {
            showNoData();
            return;
        }
        quizData = quizData.replace('json','');
        quizData = quizData.replaceAll("```","");
        quiz = JSON.parse(quizData);
        let userAnswerData = sessionStorage.getItem('useranswer');
        if (!userAnswerData) {
            showNoData();
            return;
        }
        userAnswers = userAnswerData.split('#@#');
        calculateScore();
        displayQuestions();
        
    } catch (error) {
        console.error('Error loading results:', error);
        showNoData();
    }
}

function calculateScore() {
    correctCount = 0;
    
    for (let i = 0; i < quiz.questions.length && i < userAnswers.length; i++) {
        let question = quiz.questions[i];
        let userAnswer = userAnswers[i].trim();
        let correctAnswer = question.answer.toString().trim();
        
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            correctCount++;
        }
    }
    
    // Update score display
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('total-count').textContent = quiz.questions.length;
    
    let percentage = Math.round((correctCount / quiz.questions.length) * 100);
    document.getElementById('percentage').textContent = percentage + '%';
}

function displayQuestions() {
    let container = document.getElementById('questions-container');
    container.innerHTML = '';
    
    for (let i = 0; i < quiz.questions.length; i++) {
        let question = quiz.questions[i];
        let userAnswer = i < userAnswers.length ? userAnswers[i].trim() : 'No answer';
        let correctAnswer = question.answer.toString().trim();
        let isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        
        let questionCard = createQuestionCard(question, userAnswer, correctAnswer, isCorrect, i + 1);
        container.appendChild(questionCard);
    }
}

function createQuestionCard(question, userAnswer, correctAnswer, isCorrect, questionNumber) {
    let card = document.createElement('div');
    card.className = `question-card ${isCorrect ? 'correct' : 'incorrect'}`;
    
    let typeDisplay = question.type.replace('_', ' ').toUpperCase();
    
    card.innerHTML = `
        <div class="question-header">
            <div class="question-number">Question ${questionNumber}</div>
            <div class="question-text">${question.question}</div>
            <span class="question-type">${typeDisplay}</span>
        </div>
        <div class="answer-section">
            ${createAnswerRows(question, userAnswer, correctAnswer, isCorrect)}
        </div>
    `;
    
    return card;
}

function createAnswerRows(question, userAnswer, correctAnswer, isCorrect) {
    let html = '';
    html += `
        <div class="answer-row">
            <div class="answer-content">
                <div class="answer-label correct-label">Correct Answer</div>
                <div class="answer-text correct-answer">${correctAnswer}</div>
            </div>
        </div>
    `;
    html += `
        <div class="answer-row">
            <div class="answer-content">
                <div class="answer-label ${isCorrect ? 'correct-answer' : 'user-label'}">Your Answer</div>
                <div class="answer-text ${isCorrect ? 'correct-answer' : 'incorrect-answer'}">${userAnswer || 'No answer provided'}</div>
            </div>
        </div>
    `;
    
    // Show options for MCQ
    if (question.type === 'mcq' && question.options) {
        html += `
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e9ecef;">
                <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; color: #666;">Available Options:</div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
                    ${question.options.map((option, index) => `
                        <div style="padding: 0.5rem; background:rgb(236, 234, 234); border-radius: 6px; font-size: 0.9rem;">
                        ${index + 1}. ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    return html;
}

function showNoData() {
    let container = document.getElementById('questions-container');
    container.innerHTML = `
        <div class="no-data">
            <h3>No Quiz Data Found</h3>
            <p>Take Your first step and start the Quiz Now!</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadResults);