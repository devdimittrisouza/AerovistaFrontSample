const API_PREFIX = 'http://localhost:8080';

function cadastrar(event){
    const dto = {
        cadNome: document.getElementById("inputName").value,
        cadEmail: document.getElementById("inputEmail4").value,
        cadCpf: document.getElementById("inputCPF").value,
        cadTel: document.getElementById("inputCel").value,
        cadSenha: document.getElementById("inputPassword4").value
    }

    event.preventDefault();

    fetch(API_PREFIX + "/api/cadastrar", {
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
            window.location.replace('/logado.html');
            return window.alert("Sucesso ao cadastrar.");
        }else if (retorno === 0 ){
            return window.alert("O CPF informado já está cadastrado");
        }else {
            throw new Error("Falha no cadastro");
        }
    })
    .catch(error => alert(error.message));
}