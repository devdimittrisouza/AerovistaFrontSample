const API_PREFIX = 'http://localhost:8080';

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(jsonPayload);
}

window.onload = function () {
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const payload = parseJwt(token);
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) {
    localStorage.removeItem("jwt");
    window.location.href = "index.html";
  }

  // Logout
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("jwt");
      window.location.href = "index.html"; // ou página de login
    });
  }

  document.getElementById("formOrcamento").addEventListener("submit", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("jwt"); // recupera o token salvo após login

    if (!token) {
      alert("Você precisa estar logado para solicitar um orçamento.");
      return;
    }

    const dto = {
      orcTipoEvento: document.getElementById("inputEvento").value,
      orcDataInicio: document.getElementById("dataInicio").value,
      orcDataFim: document.getElementById("dataFim").value,
      orcComplementares: document.getElementById("detalhes").value,
      fkUserId: null
    };

    fetch(API_PREFIX + "/api/private/solicitacao/orcamento", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(dto)
    })
      .then(response => {
        if (response.ok) {
          return response.text(); // retorno do backend pode ser uma mensagem simples
        } else if (response.status === 400) {
          return response.text().
            then(text => { throw new Error(text); });
        } else if (response.status === 401) {
          throw new Error("Token inválido ou expirado. Faça login novamente.");
        } else {
          throw new Error("Erro ao enviar solicitação de orçamento.");
        }
      })
      .then(msg => {
        alert("Orçamento solicitado com sucesso!");
        // Opcional: limpar formulário
        document.getElementById("formOrcamento").reset();
      })
      .catch(error => {
        alert(error.message);
      });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  flatpickr("#dataInicio", {
    minDate: "today",
    enableTime: true,
    dateFormat: "Y-m-d\\TH:i:S",  // valor real enviado (ISO)
    altInput: true,               // mostra um input alternativo legível
    altFormat: "d/m/Y H:i",       // formato visual para o usuário
    time_24hr: true,
    disableMobile: true,
    allowInput: false
  });

  flatpickr("#dataFim", {
    minDate: "today",
    enableTime: true,
    dateFormat: "Y-m-d\\TH:i:S",
    altInput: true,
    altFormat: "d/m/Y H:i",
    time_24hr: true,
    disableMobile: true,
    allowInput: false
  });
});
