require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routers = require("./router");

const port = process.env.PORT;

const app = express();

const expressValidator = require("express-validator");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routers);
app.listen(port, () => {
  console.log("Server is running");
});
