let flashcards = ["zczxc", "czczxczxcz", "vdxvcvxcvxcv"];
let index = 0;

function updateFlashcard() {
    if (sessionStorage.getItem("Cards")){
        let p = sessionStorage.getItem("Cards");
        flashcards = p.split('@#@');
        console.log(flashcards);
    }
    else
    {
        window.location.href = "/dashboard/index.html";

    }
    document.getElementById("flash").innerHTML = flashcards[index];
    document.getElementById("flashNo").innerHTML = `${index + 1}/${flashcards.length}`;
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
     window.location.href = "/dashboard/index.html";
}