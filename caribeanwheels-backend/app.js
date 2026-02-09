const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
    origin: ["https://caribeanwheelsadmin.vercel.app", "http://localhost:3000", "https://caribbean-wheels-client-gilt.vercel.app", "https://www.caribbeanwheel.com"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/car", require("./routes/car.routes"));
app.use("/api/contact", require("./routes/contact.routes"));

module.exports = app;