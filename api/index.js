const express = require("express");
const apiRoutes = require("./routers/api");
const indexRoutes = require("./routers/index");

const app = express();

app.use("/api", apiRoutes);
app.use("/", indexRoutes);

module.exports = app;
