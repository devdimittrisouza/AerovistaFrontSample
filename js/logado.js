function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

  return JSON.parse(jsonPayload);
}

window.onload = function() {
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const payload = parseJwt(token);
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) {
    localStorage.removeItem("jwt");
    window.location.href = "login.html";
  }
}

document.addEventListener('DOMContentLoaded', function () {
  flatpickr("#DataInicio", {
    minDate: "today",
    dateFormat: "d/m/Y",
    disableMobile: true,
    allowInput: false
  });

  flatpickr("#DataFim", {
    minDate: "today",
    dateFormat: "d/m/Y",
    disableMobile: true,
    allowInput: false
  });
});