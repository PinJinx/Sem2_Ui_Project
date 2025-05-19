
let questionNum = 0;
let quiz;
function GetQuestions()
{
    let txt = sessionStorage.getItem('quiz');
    txt = txt.replace('json','');
    txt = txt.replaceAll("```","");
    quiz = JSON.parse(txt);
    console.log(quiz);
    DrawQuiz();
}


function DrawQuiz()
{
    let qs = quiz.questions[questionNum];
    document.getElementById("Question").innerHTML = qs.question;

    //turn off all options
    document.getElementById("mcqdiv").style.visibility = "hidden";
    document.getElementById("tfdiv").style.visibility = "hidden";
    document.getElementById("fibdiv").style.visibility = "hidden";

    if(qs.type === "mcq")
    {
        document.getElementById("mcqdiv").style.visibility = "visible";
        //Add new options
        options = document.getElementsByClassName("mcq_op");
        for(let i = 0;i<4;i++)
        {
            options[i].innerHTML = qs.options[i];
            options[i].addEventListener("click",()=>{
                if(qs.options[i]  === qs.answer){
                    console.log("correct")
                    OnClickNext();
                }
                else{
                    console.log("wrong")
                }
            })
        }
    }
    if(qs.type === "true_false")
    {
        document.getElementById("tfdiv").style.visibility = "visible";
        let options = Array.from(document.getElementsByClassName("tf_op"));
        options.forEach(element => {
            element.addEventListener("click",()=>{
                if(element.value === qs.answer.toString()){
                    console.log("correct 2");
                    OnClickNext();
                }
                else{
                    console.log("wrong 2");
                }
            });
        });
    }
    if(qs.type === "fill_in_blank")
    {
        document.getElementById("fibdiv").style.visibility = "visible";
        document.getElementById("fib_op").addEventListener("change", (event) => {
            if (qs.answer === event.target.value) {
                console.log("correct 3");
                OnClickNext();
            }
        });
    }
}

function OnClickNext(){
    if(questionNum < quiz.questions.length - 1 ){
        questionNum ++;
        RemoveEventListners();
        DrawQuiz();
    }
}



function RemoveEventListners(){
    let options = document.getElementsByClassName("mcq_op");
    //We have to remove all event listners before we put next one
    for(let i = 0; i < options.length; i++) {
        let oldOption = options[i];
        let newOption = oldOption.cloneNode(true);
        oldOption.parentNode.replaceChild(newOption, oldOption);
    }
    options = document.getElementsByClassName("tf_op");
    for(let i = 0; i < options.length; i++) {
        let oldOption = options[i];
        let newOption = oldOption.cloneNode(true);
        oldOption.parentNode.replaceChild(newOption, oldOption);
    }
    let oldFibOp = document.getElementById("fib_op");
    oldFibOp.value = "";
    let newFibOp = oldFibOp.cloneNode(true);
    oldFibOp.parentNode.replaceChild(newFibOp, oldFibOp);
}




function OnClickBack(){
    if(questionNum > 0){
        questionNum --;
        RemoveEventListners();
        DrawQuiz();
    }
}

GetQuestions();