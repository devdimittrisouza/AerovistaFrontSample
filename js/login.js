const API_PREFIX = 'http://localhost:8080';

function login(event) {
    const dto = {
        loginEmail: document.getElementById("inputEmail4").value,
        loginSenha: document.getElementById("inputPassword4").value
    };

    event.preventDefault();

    fetch(API_PREFIX + "/api/login", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Login inválido");
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem("jwt", data.jwtToken);
        window.location.replace("logado.html");
    })
    .catch(error => {
        alert(error.message);
    });
}