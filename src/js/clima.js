import * as functions from "./functions.js";
functions.checkSession();
functions.cerrarSesion();

document.addEventListener("DOMContentLoaded", () => {
  const userName = document.getElementById("userName");
  const spanTemp = document.getElementById("spanTemp");
  const spanLocalidad = document.getElementById("spanLocalidad");
  const userLogged = localStorage.getItem("user");
  const userEmail = localStorage.getItem("correo");

  functions.opcionesSelect();

  fetch(
    `http://localhost:3000/climaLocal?user=${userLogged}&correo=${userEmail}`
  )
    .then((response) => response.json())
    .then((data) => {
      spanLocalidad.innerText = `${data.userData.localidad}`;
      userName.innerText = `${data.userData.user}`;
      const encodedLocalidad = encodeURIComponent(data.userData.localidad);
      consultarApiClima(data.pais, encodedLocalidad).then((tempActual) => {
        console.log(tempActual);
        spanTemp.innerText = `${tempActual}`;
        fetch(
          `https://geocode.maps.co/search?q=${encodedLocalidad}&api_key=65b2703b12bdc409410812jxbd55c41`
        )
          .then((response) => response.json())
          .then((data) => {
            const coord = {
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
            };
            functions.insertarMapa(coord.lat, coord.lon);
          });
      });
    });
});

const formClima = document.getElementById("formClima");
formClima.addEventListener("submit", (event) => {
  event.preventDefault();
  obtenerClima();
});

function obtenerClima(e) {
  const localidad = document.getElementById("localidad").value;
  const pais = document.getElementById("select").value;

  if (localidad.trim() == "") {
    mostrarError("No se encuentra la localidad");
    return;
  }
  parseAdress();
  consultarApiClima(pais, localidad);
}

function consultarApiClima(pais, localidad) {
  const key = `9963094be793228ca9bf57b5a25bba28`;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${localidad},${pais}&appid=${key}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod == 404) {
        mostrarError("No se encuentra la localidad");
      } else {
        return mostrarDatosApi(data);
      }
    });
}

function mostrarDatosApi(datos) {
  const {
    main: { humidity, temp },
  } = datos;
  let tempActual = (temp - 273.15).toFixed(1);
  let humedad = humidity;
  mostrarResultado(humedad, tempActual);
  return tempActual;
}

const divResultados = document.getElementById("resultados");

function mostrarResultado(humedad, temperatura) {
  const localidad = document.getElementById("localidad").value;
  const divExistente = document.getElementById("divCondiciones");
  if (localidad === "") return;
  if (divExistente) {
    divCondiciones.innerHTML = `<p class="tituloResult">${localidad}</p><p>La temperatura es <span class='spanTemperatura'>${temperatura}º</span></p><p>La humedad es <span class='spanTemperatura'>${humedad}%</span></p>`;
  } else {
    const divCondiciones = document.createElement("div");
    divCondiciones.classList.add("tempLocal");
    divCondiciones.setAttribute("id", "divCondiciones");
    divCondiciones.innerHTML = `<p class="tituloResult">${localidad}</p><p>La temperatura es <span class='spanTemperatura'>${temperatura}º</span></p><p>La humedad es <span class='spanTemperatura'>${humedad}%</span></p>`;
    divResultados.appendChild(divCondiciones);
  }
  addToHistory(localidad, temperatura, humedad);
}

function mostrarError(mensaje) {
  const divExistente = document.getElementById("divCondiciones");
  if (divExistente) {
    divExistente.remove();
  }
  const divError = document.createElement("div");
  divError.classList.add("divError");
  divError.innerHTML = `<p id="mensajeError">${mensaje}</p>`;
  divResultados.appendChild(divError);

  setTimeout(() => {
    divError.remove();
  }, 2500);
}

function parseAdress() {
  const encodedLocalidad = encodeURIComponent(
    document.getElementById("localidad").value
  );
  fetch(
    `https://geocode.maps.co/search?q=${encodedLocalidad}&api_key=65b2703b12bdc409410812jxbd55c41`
  )
    .then((response) => response.json())
    .then((data) => {
      const coord = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
      functions.changeMap(coord.lat, coord.lon);
    });
}

function addToHistory(local, temp, hum) {
  const newHistory = document.createElement("div");
  const divHistory = document.getElementById("history");
  let gridOrder = 1;
  const maxCards = 3;
  newHistory.classList.add("cardHistory");
  newHistory.innerHTML = `<div class="cardHistory"><p class="tituloResult">${local}</p><p>La temperatura es <span class='spanTemperatura'>${temp}º</span></p><p>La humedad es <span class='spanTemperatura'>${hum}%</span></p></div>`;
  if (divHistory.childElementCount >= maxCards) {
    divHistory.removeChild(divHistory.firstElementChild);
  }
  
 if (divHistory.childNodes.length < 1) {
  newHistory.style.order = gridOrder;
 }  else {
  Array.from(divHistory.childNodes)
    .filter((node) => node.nodeType === Node.ELEMENT_NODE) // Filter only element nodes
    .forEach((item) => {
      item.style.order = ++gridOrder;
    });
}


  divHistory.appendChild(newHistory);
}
