
let apikey = "AIzaSyCylC6TyToVYgBIdptfgBycVBH1F45l6Vw";
let prompt = "";

let question_num = 10;
let flashcard_num = 10;
let question_difficulty = "easy";
let questionformat = "mcq,";


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
                    "parts": [{"text":`Generate with a quiz with options in all cases as just a json file something like this{{"title": "Sample Quiz","difficulty": "medium","questions": [{"type": "mcq","question": "Which planet is known as the Red Planet?","options": ["Earth", "Mars", "Jupiter", "Saturn"],"answer": "Mars"},{"type": "fill_in_blank","question": "The chemical symbol for water is ____.","answer": "H2O"},{"type": "true_false","question": "The Great Wall of China is visible from the moon.","answer": false}]}} no additional text consisting of ${questionformat} with a difficulty ${question_difficulty}  on the topic:`+prompt}]
                }]
            })
        })
        const data  = await response.json();
        if (data.candidates && data.candidates[0].content) {
            let text = data.candidates[0].content.parts[0].text;
            sessionStorage.setItem("quiz",text);
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
                    "parts": [{"text":`Generate a comprehensive list of key points from the provided source which must be comprised in maximum of ${flashcard_num} points that would be ideal for creating flashcards. Each point should capture an essential concept, definition, fact, or relationship that would be important to remember. Format it as list of string like ["point 1","point two"] must be in this exact format just this without explanations or commentary. Focus only on the most significant information that would be valuable for study and retention. Source text:`+prompt}]
                }]
            })
        })
        const data  = await response.json();

        if (data.candidates && data.candidates[0].content) {
            let text = data.candidates[0].content.parts[0].text;
            //Its getting stored here
            sessionStorage.setItem("Cards",text);
        } else {
            console.log('No response');
        }
    }
    catch(error){
        console.log(error);
    }
}

