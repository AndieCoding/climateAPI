function checkSession() {
    const logged = localStorage.getItem('logged');
    if (!logged) window.location.href = "./index.html"
}

function opcionesSelect() {
    const select = document.getElementById("select");
    const paises = [
      "Argentina",
      "Bolivia",
      "Brasil",
      "Chile",
      "Colombia",
      "Ecuador",
      "Guyana",
      "Paraguay",
      "Perú",
      "Surinam",
      "Uruguay",
      "Venezuela",
    ];
    const opciones = paises.map((x) => {
      return `<option value="${x}">${x}</option>`;
    });
    select.innerHTML = opciones.join("");
  }

let map;
function insertarMapa(lat, lon) {
  map = L.map("map").setView([lat, lon], 12);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map); 
  const circle = L.circle([lat, lon], {
    color: "light-blue",
    fillColor: "#6C98C1",
    fillOpacity: 0.2,
    radius: 6000,
  }).addTo(map);
}

function changeMap(lat, lon) {
  map.setView(new L.LatLng(lat, lon), 12);
  const circle = L.circle([lat, lon], {
    color: "light-blue",
    fillColor: "#6C98C1",
    fillOpacity: 0.2,
    radius: 6000,
  }).addTo(map);
}

function cerrarSesion() {
const btnSalir = document.getElementById("logOff");
btnSalir.addEventListener("click", () => {
  localStorage.removeItem("logged");
  localStorage.removeItem("user");
  localStorage.removeItem("correo");
  localStorage.removeItem("userID");  
  window.location.href = "/index.html";
});
}
 
export { opcionesSelect, checkSession, insertarMapa, changeMap, cerrarSesion };


