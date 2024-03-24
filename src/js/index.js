const inputPassword = document.getElementById("pass");
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

const formLogin = document.getElementById("login");

formLogin.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = document.getElementById("user").value;
  const pass = inputPassword.value;
  const login = {
    user,
    pass,
  };

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(login),
  }).then((response) => {
    response.json().then((data) => {
      console.log(data);
      if (data.success) {
        localStorage.setItem("logged", "true");
        localStorage.setItem("user", user);
        localStorage.setItem("correo", data.matchedUser.correo);
        window.location.href = "./clima.html";
      } else {
        invalidUser();
      }
    });
  });
});

const invalidUser = () => {
  const divContenedor = document.getElementById("displayError");
  const divError = document.createElement("div");
  divError.classList.add("loginError");
  divError.innerHTML = `<p><span>&#10006;</span> La cuenta ingresada no es correcta</p>`;
  divContenedor.appendChild(divError);

  setTimeout(() => {
    divError.remove();
  }, 2000);
};
