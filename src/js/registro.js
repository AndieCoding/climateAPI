import * as functions from "./functions.js";
functions.opcionesSelect();

const formRegistro = document.getElementById("registro");
formRegistro.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = {
    name: document.getElementById("name").value,
    correo: document.getElementById("correo").value,
    pais: document.getElementById("select").value,
    localidad: document.getElementById("localidad").value,
    user: document.getElementById("user").value,
    pass: document.getElementById("pass").value,
  };

  let formData = new FormData();
  for (const key in user) {
    formData.append(key, user[key]);
  }

  const formJson = JSON.stringify(Object.fromEntries(formData));
  fetch("http://localhost:3000/submitRegistro", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: formJson,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data === "success") {
        window.location.href = "index.html";
      } else {
        invalidData(data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

const invalidData = (error) => {
  const divContenedor = document.getElementById("displayError");
  const divError = document.createElement("div");
  divError.classList.add("loginError");
  divError.innerHTML = `<p><span>&#10006;</span> ${error}</p><br>`;
  divContenedor.appendChild(divError);

  setTimeout(() => {
    divError.remove();
  }, 3000);
};

// mostrar-ocultar password
const inputPassword = document.getElementById("pass");
const imgCloseEye = document.getElementById("img-close-eye");
const imgOpenEye = document.getElementById("img-open-eye");

imgOpenEye.addEventListener("click", showHide);
imgCloseEye.addEventListener("click", showHide);

function showHide() {
  inputPassword.type = inputPassword.type === "text" ? "password" : "text";

  if (inputPassword.type === "text") {
    imgOpenEye.style.display = "none";
    imgCloseEye.style.display = "inline";
  } else {
    imgCloseEye.style.display = "none";
    imgOpenEye.style.display = "inline";
  }
}
