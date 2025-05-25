const API_PREFIX = 'http://localhost:8080';

function login(event){
    const dto = {
        loginEmail: document.getElementById("inputEmail4").value,
        loginSenha: document.getElementById("inputPassword4").value
    }

    event.preventDefault();

    fetch(API_PREFIX + "/api/login", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dto)
    })
    .then(response => response.text())
    .then(text => {
        var retorno = parseInt(text);
        if (retorno === 1) {
            window.location.replace('logado.html');
            return window.alert('Login realizado com sucesso!');
        }else if(retorno === 0){
            return window.alert('Email não encontrado!')
        }
        else {
            throw new Error("Falha no login");
        }
    })
    .catch(error => alert(error.message));
}