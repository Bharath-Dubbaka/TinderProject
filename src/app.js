//grouping modules

const express = require("express");

const app = express();


//getting data from URL params
app.get("/user/:name/:email", (req, res) => {
   console.log(req.params);
   const params = req.params;
   res.send({ params, from: "paramURL" });
});

//order of the routes do matter
// app.use("/hello/2", (req, res) => {
//    res.send("hello/2");
// });

// app.use("/hello", (req, res) => {
//    res.send("hello");
// });

// app.use("/test", (req, res) => {
//    res.send("test");
// });

// app.use("/", (req, res) => {
//    res.send("Hello main page");
// });

app.listen(9999, () => {
   console.log("express is up and running in port 9999");
});
