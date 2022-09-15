const input = document.querySelector('.login-input');
const button = document.querySelector('.login-button');
const form = document.querySelector('.login-form');

const validateInput = ({target}) =>{
    if(target.value.length > 2){
        button.removeAttribute('disabled');
    }else{
        button.setAttribute('disabled', 'disabled');
    }
}

const handleSubmit = (event) => {
    event.preventDefault(); //Previne que o formulário recarregue a página quando você utilizar o submit
    //Local Storage
    let playerName = input.value.trim()
    localStorage.setItem('player', playerName);
    window.location = 'pages/game.html';
}

input.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);