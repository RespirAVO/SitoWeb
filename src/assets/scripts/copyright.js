// funzione per calcolare il passare degli anni per aggiornare il copyright
function date() {
    const container = document.querySelector(".footer--license");
    const birthYear = "2022";
    let dateNow = new Date().getTime();
    let currentYear = new Date(dateNow).getFullYear();

    if (currentYear != birthYear)
        container.innerHTML = `CC By Classe 3C Info a.s. 2021/2022 - Copyright ${birthYear}-${currentYear} &copy;`
    else 
        console.log("ERRORE!")
}