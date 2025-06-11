
let apikey = "AIzaSyCylC6TyToVYgBIdptfgBycVBH1F45l6Vw";
let prompt = "";

let question_num = 10;
let flashcard_num = 10;
let question_difficulty = "easy";
let questionformat = "mcq,";
let storyCloseness = 0;

document.addEventListener('DOMContentLoaded', () => {
    //Checking
    document.getElementById('prompt').addEventListener('change',(event)=>{
        prompt = event.target.value;
        sessionStorage.setItem("prompt",prompt);
        console.log(prompt);
    })

    document.getElementById('questions').addEventListener("change",(event)=>{
        question_num = event.target.value;
        console.log(question_num);
    })

    document.getElementById('card_num').addEventListener("change",(event)=>{
        flashcard_num = event.target.value;
        console.log(flashcard_num);
    })


    document.querySelectorAll(".chckbox").forEach((element)=>{
        element.addEventListener('change',()=>{
            if(element.checked){
                questionformat += element.value;
            }
            else{
                questionformat = questionformat.replace(element.value,"");
            }
        if(questionformat === ""){
            questionformat = "mcq,";
            document.getElementById("mcq").checked = true;
        }
        console.log(questionformat);
        })
    })

    const storyClosenessInput = document.getElementById('story_closeness');
    const storyClosenessValue = document.getElementById('story_closeness_value');
    storyClosenessInput.addEventListener('input', () => {
        storyCloseness=storyClosenessInput.value;
        storyClosenessValue.textContent = `${storyCloseness}%`;
    });

    document.querySelectorAll(".difficulty_bttns").forEach(element => {
        element.addEventListener('change', () => {
            if (element.checked) {
                question_difficulty = element.value;
                console.log(question_difficulty);
            }
        });
    });
});





async function onGenerateSummary()
{
    document.getElementById("summary_placeholder").innerHTML = 'Hold on tight! Generating feed!';
    try{
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="+apikey,{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                "contents": [{
                    "parts": [{"text":"generate a short summary for"+prompt}]
                }]
            })
        })

    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error.message);
    }
    if (data.candidates && data.candidates[0].content) {
        //Sucess then,
        let text = data.candidates[0].content.parts[0].text;
        document.getElementById("summary_placeholder_text").style.visibility = 'hidden';
        document.getElementById("summary_placeholder_text").style.height = 0;
        document.getElementById("summary_box").style.visibility = 'visible';
        document.getElementById('summary_box').innerText = text;
    } else {
        console.log('No response');
    }
    }
    catch(error){
        console.log(error);
    }
}


async function GenerateQuiz()
{

    try{
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="+apikey,{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                "contents": [{
                    "parts": [{"text":`Generate a quiz with ${question_difficulty} difficulty having ${question_num} much questions with the following question types:${questionformat} on the topic: ${prompt} The response should be in JSON format with the following structure make sure it is easily parsable in js:
                        {
                            "title": "Something Quiz",
                            "difficulty": "${question_difficulty}",
                            "questions": [
                            {
                                "type": "choose from mcq/true_false/fill_in_blank",
                                "question": "Question text here?",
                                "options": ["Option 1", "Option 2", "Option 3", "Option 4"] (applicable only for mcq type),
                                "answer": "Correct option/answer here"
                            },
                        ]
                        }`}]
                }]
            })
        })
        const data  = await response.json();
        if (data.candidates && data.candidates[0].content) {
            let text = data.candidates[0].content.parts[0].text;
            sessionStorage.setItem("quiz",text);
            window.location.href = "/Sem2_Ui_Project/quiz/index.html";
        } else {
            console.log('No response');
        }
    }
    catch(error){
        console.log(error);
    }
}

function QuizPopup(){
    let ele = document.getElementById("Quiz_popup");
    ele.style.visibility = (ele.style.visibility === "visible") ? "hidden" : "visible";
}

function FlashCardPopup(){
    let ele = document.getElementById("flashcard_popup");
    ele.style.visibility = (ele.style.visibility === "visible") ? "hidden" : "visible";
}

function StoryPopup(){
    let ele = document.getElementById("story_popup");
    ele.style.visibility = (ele.style.visibility === "visible") ? "hidden" : "visible";
}

//This is for flashcards
async function GenerateFlashCards()
{
    try{
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="+apikey,{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                "contents": [{
                    "parts": [{"text":`Generate a comprehensive list of key points from the provided source which must be comprised in maximum of ${flashcard_num} points that would be ideal for creating flashcards. Each point should capture an essential concept, definition, fact, or relationship that would be important to remember. Format it like point1@#@point2@#@point3 must be in this exact format nothing else just this without explanations or commentary. Focus only on the most significant information that would be valuable for study and retention. Source text:`+prompt}]
                }]
            })
        })
        const data = await response.json();
        if (data.candidates && data.candidates[0].content) {
            let text = data.candidates[0].content.parts[0].text;
            //Its getting stored here
            sessionStorage.setItem("Cards",text);
            window.location.href = "/Sem2_Ui_Project/flashcard/index.html";
        } else {
            console.log('No response');
        }
    }
    catch(error){
        console.log(error);
    }
}


async function GenerateStory()
{
    try{
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="+apikey,{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                "contents": [{
                    "parts": [{"text":`Write a complete and creative short story that captures and communicates about the core concept where you can take upto ${100-storyCloseness}/100 liberty (where 0 -> fully creative 100 ->strictly only on text) presented in the following source text. The story should express the main ideas, themes, or message through its characters, plot, and setting. The concept sould be clearly understood by the reader through the narrative itself.start with a title for the story(dont give text like 'title' with it)followed by @#@ then Split the story into clearly defined sections and dont give section titles a (such as Introduction, Conflict, Climax, Resolution, etc.), and separate each section using the symbol @#@.At the end of prompt append @#@ followed  keywords (without any title text like 'keywords:') that describe the content of each page seperate these keywords with $ Source text:`+prompt}]
                }]
            })
        })
        const data  = await response.json();
        if (data.candidates && data.candidates[0].content) {
            let text = data.candidates[0].content.parts[0].text;
            sessionStorage.setItem("Story",text);
            window.location.href = "/Sem2_Ui_Project/story/index.html";
        } else {
            console.log('No response');
        }
    }
    catch(error){
        console.log(error);
    }
}


