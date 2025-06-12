let notes;
function updateFlashcard() {
    if (sessionStorage.getItem("notes")){
        notes = sessionStorage.getItem("notes");
    }
    else
    {
        window.location.href = "/Sem2_Ui_Project/dashboard/index.html";
    }
    document.getElementById("notes").innerHTML = notes;
}

updateFlashcard();


function quit(){
    window.location.href = "/Sem2_Ui_Project/dashboard/index.html";
}