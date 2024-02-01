const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const debug = require("debug")("backend:server");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public")));

// databases
global.main = require("./config/main_db.config");

// routes
app.get("/health", (req, res) => res.send(`Apps is healthy`));
app.get("/", (req, res) => res.send(`Welcome to Backend`));

const routes = [
  {
    path: "/api/auth",
    controller: require("./controllers/authentication.controller"),
  },
  {
    path: "/api/authorization",
    controller: require("./controllers/authorization.controller"),
  },
  { path: "/api/agama", controller: require("./controllers/agama.controller") },
  {
    path: "/api/golongan-darah",
    controller: require("./controllers/golongan_darah.controller"),
  },
  {
    path: "/api/jenis-kelamin",
    controller: require("./controllers/jenis_kelamin.controller"),
  },
  {
    path: "/api/tingkat-pendidikan",
    controller: require("./controllers/tingkat_pendidikan.controller"),
  },
  {
    path: "/api/posisi",
    controller: require("./controllers/posisi.controller"),
  },
  { path: "/api/user", controller: require("./controllers/user.controller") },
];
routes.forEach(({ path, controller }) => app.use(path, controller));

app.use((req, res, next) => {
  return res.status(404).send({ error: true, message: "Invalid routes!" });
});

module.exports = app;
