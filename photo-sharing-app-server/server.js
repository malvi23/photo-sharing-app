const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
const { mongoose } = require('./db.js');
const routes = require("./routes.js");
var cors = require("cors");
const { environment } = require("./env.js");

app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    credentials: true,
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", true);
  res.header("Access-Control-Allow-Credentials", "Content-Type");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});

// API routes
app.use(`/api/${environment.API_VERSION}`, routes);

// Start the server
app.listen(port, () => {
  console.log(`${new Date().toISOString()} : Server is running on port ${port}`);
});

