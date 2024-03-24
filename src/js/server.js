const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

const fs = require("fs");
let users = require("./usuarios.json");

const path = require("path");
const filePath = path.join(__dirname, "usuarios.json");

app.use(express.static(process.cwd() + "/src"));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/src/index.html");
});

app.post("/login", (req, res) => {
  const loginData = req.body;
  const matchedUser = users.find(
    (user) => user.user === loginData.user && user.pass === loginData.pass
  );
  if (matchedUser) {
    res.json({
      success: true,
      message: "Login successful",
      matchedUser: matchedUser,
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/submitRegistro", (req, res) => {
  const registeredUser = { ...req.body, id: users.length + 1 };
  const existentUser = users.find(
    (user) => user.user === registeredUser.user
  );
  if (existentUser) {
    return res.json(`${registeredUser.user} se encuentra registrado`);
  }
  const existentEmail = users.find(
    (user) => user.correo === registeredUser.correo
  )
  if (existentEmail) {
    return res.json(`${registeredUser.correo} se encuentra registrado`);
  } else {
  users.push(registeredUser);
  fs.writeFileSync(filePath, JSON.stringify(users));
  console.log("Success");
  res.json("success");
}
});

app.get("/climaLocal", (req, res) => {
  const getUser = req.query;
  const userData = users.find(
    (user) => user.user === getUser.user && user.correo === getUser.correo
  );
  if (userData) {
    console.log(userData);
    res.json({ userData });
  } else {
    res
      .status(401)
      .json({ success: false, message: "No se encontró localidad" });
  }
});

app.put("/userConfig/:id", (req, res) => {
  const updatedInfo = req.body;
  const userID = parseInt(req.params.id);
  const user = users.findIndex((user) => user.id == userID);

  if (user !== -1) {
    users[user] = { ...users[user], ...updatedInfo };
    fs.writeFileSync(filePath, JSON.stringify(users));
    res.json({ success: true, message: "User data updated successfully" });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

app.delete("/deleteAccount", (req, res) => {  
  const idToDelete = parseInt(req.query.id);
  const userIndex = users.findIndex((user) => user.id === idToDelete);  
  if (userIndex !== -1) {    
    users.splice(userIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(users));
    res.json({ success: true, message: "User deleted successfully" });    
  } else {    
    res.status(404).json({ success: false, message: "User not found" });
  }
})

app.post("/:id/historial", (req, res) => {
  const newHistory = req.body;
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);
  users[userIndex].history.push(newHistory);
  console.log("Success");
  res.json("success");
});
 
app.use(function (req, res) {
  res.status(404).end('error');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
