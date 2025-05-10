
let apikey = "AIzaSyCylC6TyToVYgBIdptfgBycVBH1F45l6Vw";
let prompt = "";

document.getElementById('prompt').addEventListener('change',(event)=>{
    prompt = event.target.value;
    sessionStorage.setItem("prompt",prompt);
    console.log(prompt);
})



async function onGenerateSummary()
{
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
        document.getElementById('summary').innerText = text;
    } else {
        console.log('No response');
    }
    }
    catch(error){
        console.log(error);
    }
}