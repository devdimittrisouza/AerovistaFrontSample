const API_PREFIX = 'http://localhost:8080';

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  return JSON.parse(jsonPayload);
}

function sanitizeInput(input) {
  const div = document.createElement("div");
  div.innerText = input;
  return div.innerHTML.trim();
}

function escapeHtml(text) {
  if (!text) return '-';
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
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

  const form = document.getElementById("formOrcamento");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const dto = {
        orcTipoEvento: sanitizeInput(document.getElementById("inputEvento").value),
        orcDataInicio: sanitizeInput(document.getElementById("dataInicio").value),
        orcDataFim: sanitizeInput(document.getElementById("dataFim").value),
        orcComplementares: sanitizeInput(document.getElementById("detalhes").value),
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
          form.reset();
          carregarGrid();
        })
        .catch(error => {
          alert(error.message);
        });
    });
  }

  carregarGrid();
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
        container.textContent = "Nenhum orçamento encontrado.";
        return;
      }

      let html = '<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">';
      html += "<thead><tr>";
      html += "<th>Tipo Evento</th>";
      html += "<th>Data Início</th>";
      html += "<th>Data Fim</th>";
      html += "<th>Detalhes</th>";
      html += "</tr></thead><tbody>";

      data.forEach(orc => {
        html += "<tr>";
        html += `<td>${escapeHtml(orc.orcTipoEvento)}</td>`;
        html += `<td>${new Date(orc.orcDataInicio).toLocaleString()}</td>`;
        html += `<td>${new Date(orc.orcDataFim).toLocaleString()}</td>`;
        html += `<td>${escapeHtml(orc.orcComplementares)}</td>`;
        html += "</tr>";
      });

      html += "</tbody></table>";
      container.innerHTML = html;
    })
    .catch(error => {
      console.error(error);
      const container = document.getElementById("gridOrcamentos");
      if (container) container.textContent = "Erro ao carregar os orçamentos.";
    });
}
