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