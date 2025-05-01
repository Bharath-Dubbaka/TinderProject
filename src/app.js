//grouping modules

const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
   res.send("hello");
});

app.use("/test", (req, res) => {
   res.send("test");
});

app.use("/", (req, res) => {
   res.send("Hello main page");
});

app.listen(9999, () => {
   console.log("express is up and running in port 9999");
});
