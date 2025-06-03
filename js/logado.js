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
    return;
  }

  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("jwt");
      window.location.href = "index.html";
    });
  }

  document.getElementById("formOrcamento").addEventListener("submit", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("jwt");
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
        return response.text();
      } else if (response.status === 400) {
        return response.text().then(text => { throw new Error(text); });
      } else if (response.status === 401) {
        throw new Error("Token inválido ou expirado. Faça login novamente.");
      } else {
        throw new Error("Erro ao enviar solicitação de orçamento.");
      }
    })
    .then(msg => {
      alert("Orçamento solicitado com sucesso!");
      document.getElementById("formOrcamento").reset();
      carregarGrid(); // recarrega o grid depois de solicitar novo orçamento
    })
    .catch(error => {
      alert(error.message);
    });
  });

  carregarGrid(); // carrega o grid junto com a pagina
};

document.addEventListener('DOMContentLoaded', function () {
  flatpickr("#dataInicio", {
    minDate: "today",
    enableTime: true,
    dateFormat: "Y-m-d\\TH:i:S",
    altInput: true,
    altFormat: "d/m/Y H:i",
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

function carregarGrid() {
  const token = localStorage.getItem("jwt");
  if (!token) {
    alert("Token não encontrado. Faça login novamente.");
    window.location.href = "index.html";
    return;
  }

  fetch(API_PREFIX + "/api/private/solicitacao/orcamento/meus", {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erro ao carregar a lista de orçamentos.");
    }
    return response.json();
  })
  .then(data => {
    const container = document.getElementById("gridOrcamentos");
    if (!container) return;

    if (data.length === 0) {
      container.innerHTML = "<p>Nenhum orçamento encontrado.</p>";
      return;
    }

    // monta o grid com os orçamentos do usuario
    let html = '<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">';
    html += "<thead><tr>";
    html += "<th>Tipo Evento</th>";
    html += "<th>Data Início</th>";
    html += "<th>Data Fim</th>";
    html += "<th>Detalhes</th>";
    html += "</tr></thead><tbody>";

    data.forEach(orc => {
      html += "<tr>";
      html += `<td>${orc.orcTipoEvento || '-'}</td>`;
      html += `<td>${new Date(orc.orcDataInicio).toLocaleString() || '-'}</td>`;
      html += `<td>${new Date(orc.orcDataFim).toLocaleString() || '-'}</td>`;
      html += `<td>${orc.orcComplementares || '-'}</td>`;
      html += "</tr>";
    });

    html += "</tbody></table>";
    container.innerHTML = html;
  })
  .catch(error => {
    console.error(error);
    const container = document.getElementById("gridOrcamentos");
    if (container) container.innerHTML = "<p>Erro ao carregar os orçamentos.</p>";
  });
}

