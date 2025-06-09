const API_PREFIX = 'http://localhost:8080';

formEmail = document.getElementById("inputEmail4");
erroEmail = document.getElementById("spanEmail");

formTel = document.getElementById("inputCel");
erroTel = document.getElementById("spanTelefone");

formCpf = document.getElementById("inputCPF");
erroCpf = document.getElementById("spanCpf");

formSenha = document.getElementById("inputPassword4");
erroSenha = document.getElementById("spanSenha");

document.getElementById("formCadastro").addEventListener("submit", function(event) {
    event.preventDefault();

    var emailOk = validarEmail();
    var telOk = validarTelefone();
    var cpfOk = validarCpf();
    var senhaOk = validarSenha();

    if (emailOk && telOk && cpfOk && senhaOk) {
        const dto = {
            cadNome: document.getElementById("inputName").value,
            cadEmail: document.getElementById("inputEmail4").value,
            cadCpf: document.getElementById("inputCPF").value,
            cadTel: document.getElementById("inputCel").value,
            cadSenha: document.getElementById("inputPassword4").value
        };

        fetch(API_PREFIX + "/api/cadastrar", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        })
        .then(async response => {
            const message = await response.text();
            if (response.ok) {
                alert(message);
                window.location.replace('/logado.html');
            } else if (response.status === 409) {
                alert(message); // Mensagem do tipo "CPF já cadastrado"
            } else {
                throw new Error("Erro inesperado no cadastro");
            }
        })
        .catch(error => alert(error.message));
    }
});

function validarEmail() {
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var email = formEmail.value.trim();

    if (!emailPattern.test(email)) {
        erroEmail.textContent = "Por favor, assegure que seu email contém '@'.";
        return false;
    } else {
        erroEmail.textContent = "";
        return true;
    }
}

function validarTelefone() {
    var telPattern = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
    var tel = formTel.value.trim();

    if (!telPattern.test(tel)) {
        erroTel.textContent = "Por favor, assegure que seu telefone segue o padrão: (99) 99999-9999 ou (99) 9999-9999";
        return false;
    } else {
        erroTel.textContent = "";
        return true;
    }
}

function validarCpf() {
    var cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    var cpf = formCpf.value.trim();

    if (!cpfPattern.test(cpf)) {
        erroCpf.textContent = "Por favor, assegure que seu CPF segue o padrão: 999.999.999-99";
        return false;
    } else {
        erroCpf.textContent = "";
        return true;
    }
}

function validarSenha() {
    var senhaPattern = /^(?=.*[@#!$%^&*()_+\-=\[\]{}|\\:;"'<>,.?/~`]).{8,}$/;
    var senha = formSenha.value;

    if (!senhaPattern.test(senha)) {
        erroSenha.textContent = "Por favor, assegure que sua senha contém no mínimo 8 caracteres, com ao menos 1 caracter especial.";
        return false;
    } else {
        erroSenha.textContent = "";
        return true;
    }
}
