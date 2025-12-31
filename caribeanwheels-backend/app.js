const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/car", require("./routes/car.routes"));

module.exports = app;