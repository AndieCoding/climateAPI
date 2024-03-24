const btnSalir = document.getElementById("logOff");
btnSalir.addEventListener("click", () => {
  localStorage.removeItem("logged");
  localStorage.removeItem("user");
  localStorage.removeItem("correo");
  localStorage.removeItem("userID");
  window.location.href = "/index.html";
});

const logged = localStorage.getItem("logged");
if (!logged) window.location.href = "./index.html";

let userPass;
document.addEventListener("DOMContentLoaded", () => {
  const userName = document.getElementById("userName");
  
  const userEmail = document.getElementById("correo");
  const userCountry = document.getElementById("pais");
  const userTown = document.getElementById("localidad");
  const userAcc = document.getElementById("user");
  const userLogged = localStorage.getItem("user");
  const userEmailLS = localStorage.getItem("correo");
  fetch(
    `http://localhost:3000/climaLocal?user=${userLogged}&correo=${userEmailLS}`
  )
    .then((response) => response.json())
    .then((data) => {      
      userName.innerText = `${data.userData.user}`;
      userEmail.innerText = `${data.userData.correo}`;
      userCountry.innerText = `${data.userData.pais}`;
      userTown.innerText = `${data.userData.localidad}`;
      userAcc.innerText = `${data.userData.user}`;
      userPass = data.userData.pass;
      localStorage.setItem("userID", data.userData.id);
    });
});

function editar(option) {
  const p = document.getElementById(option);
  document.getElementById("editIcon_" + option).style.display = "none";
  if (option === "pass" || option === "acc") {
    localStorage.setItem("optionClicked", option);
    return openEmergente();
  }
  if (option === "pais") {
    return opcionesSelect();
  }
  document.getElementById("checkIcon_" + option).style.display = "inline";
  const input = document.createElement("input");
  input.type = "text";
  input.value = p.textContent;
  p.replaceWith(input);
  input.focus();
}

function guardar(option) {
  document.getElementById("checkIcon_" + option).style.display = "none";
  document.getElementById("editIcon_" + option).style.display = "inline";
  const input = document.querySelector("input");    
  const newValue = input.value;
  const newP = document.createElement("p");
  newP.setAttribute("id", option);

  if (option === 'pais') {
    const select = document.querySelector("select");
    const newValue = select.value; 
    newP.textContent = newValue;
    select.replaceWith(newP);
    guardarEnSV({ [option]: newValue });
  }

  
  newP.textContent = newValue;
  if (newValue === "") {
    input.value = "El campo no puede estar vacío";
    mensaje = input.value;
    setTimeout(() => {}, 2000);
    return;
  }  
  input.replaceWith(newP);
  guardarEnSV({ [option]: newValue });
}

function guardarEnSV(data) {
  const userID = localStorage.getItem("userID");
  fetch(`http://localhost:3000/userConfig/${userID}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error("Error:", error));
}

function openEmergente() {
  const emergente = document.getElementById("confirmPass");
  const inputEmergente = document.getElementById("confirmInput");
  document.body.classList.add("emergente-open");
  inputEmergente.focus();
  emergente.style.display = "flex";
}

function closeEmergente() {
  const emergente = document.getElementById("confirmPass");
  iconsPassword();
  document.getElementById("confirmInput").value = "";
  document.body.classList.remove("emergente-open");
  emergente.style.display = "none";
}

const btnPass = document.getElementById("confirmButton");
btnPass.addEventListener("click", async function () {
  const option = localStorage.getItem("optionClicked");
  const passValido = iconsPassword();
  if (option === "acc" && passValido === true) {
    const userID = localStorage.getItem("userID");
    const data = await deleteReq(userID);
    localStorage.setItem("data", JSON.stringify(data));
    localStorage.clear();
    window.location.href = "./index.html";
  }
  if (!passValido) {
    localStorage.removeItem("optionClicked");
    const emergente = document.getElementById("confirmPass");
    document.getElementById("confirmInput").value = "";
    document.body.classList.remove("emergente-open");
    emergente.style.display = "none";
  }
  if (option === "pass" && passValido) {
    localStorage.removeItem("optionClicked");
    const input = document.createElement("input");
    input.type = "text";
    input.value = userPass;
    input.setAttribute("id", "newPass");
    document.getElementById("pass").replaceWith(input);
    closeEmergente();
    input.focus();
  }
});

function iconsPassword() {
  let pass = document.getElementById("confirmInput").value;
  const option = localStorage.getItem("optionClicked");
  if (option === "acc") {
    document.getElementById("editIcon_acc").style.display = "block";
    return true;
  }
  if (pass !== userPass || pass === "") {
    document.getElementById("checkIcon_pass").style.display = "none";
    document.getElementById("editIcon_pass").style.display = "inline";
    return false;
  } else {
    document.getElementById("checkIcon_pass").style.display = "inline";
    document.getElementById("editIcon_pass").style.display = "none";
    document.getElementById("editIcon_acc").style.display = "block";
    return true;
  }
}

const inputPassword = document.getElementById("confirmInput");
const imgCloseEye = document.getElementById("img-close-eye");
const imgOpenEye = document.getElementById("img-open-eye");

function showEyeIcon() {
  if (inputPassword.value !== "") {
    imgOpenEye.style.display = "inline";
  }
}

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

function opcionesSelect() {
  const p = document.getElementById("pais");
  const select = document.createElement("select");
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
  document.getElementById("checkIcon_pais").style.display = "inline";
  p.replaceWith(select);  
}

async function deleteReq(id) {
  let response = await fetch(`http://localhost:3000/deleteAccount?id=${id}`, {
    method: "DELETE",
  });
  let json = await response.json();

  return json;
}
