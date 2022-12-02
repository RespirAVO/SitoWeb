function changeLogo() {
    let logoImg = document.querySelector('.logo');

    logoImg.addEventListener('mouseover', ()=> {
        logoImg.src = 'src/assets/images/loghi/logo_green.png';
    })

    logoImg.addEventListener('mouseout', ()=> {
        logoImg.src = 'src/assets/images/loghi/logo_bas.png';
    })

    console.log("Grazie per aver visitato il nostro sito web :)");
}