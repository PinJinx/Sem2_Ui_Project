let flashcards = ["zczxc", "czczxczxcz", "vdxvcvxcvxcv"];
let index = 0;

function updateFlashcard() {
    if (sessionStorage.getItem("Story")){
        let p = sessionStorage.getItem("Story");
        flashcards = p.split('@#@');
        flashcards.pop()
        let keywords = p.split('@#@').pop().split("$");
        let query = keywords[index-1];
        
        fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=KCRv8XcGZW8Al02Eeu0SAG1S3s4nIgRIk-DKF97ndmI`)
            .then(response => response.json())
            .then(data => {
            if (data.results && data.results.length > 0) {
                let imageUrl = data.results[0].urls.small;
                document.getElementById("flashImage").src = imageUrl;
            } else {
                console.error("No images found for the given keywords.");
            }
            })
            .catch(error => console.error("Error fetching image from Unsplash:", error));
    }
    else
    {
        window.location.href = "/Sem2_Ui_Project/dashboard/index.html";

    }
    document.getElementById("flash").innerHTML = flashcards[index];
    document.getElementById('contents').style.fontSize = index==0?"5rem":"2rem"
}

updateFlashcard();


function backward() {
    if (index > 0) {
        index -= 1;
        updateFlashcard();
    }
}

function forward() {
    if (index < flashcards.length - 1) {
        index += 1;
        updateFlashcard();
    }
}


function quit(){
    window.location.href = "/Sem2_Ui_Project/dashboard/index.html";
}