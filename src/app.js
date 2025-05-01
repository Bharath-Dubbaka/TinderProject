const express = require("express");
const { connectDB } = require("./config/database");
const app = express();

connectDB()
   .then(() => {
      console.log("connection to clusterDB successful");
      app.listen(9999, () => {
         console.log("express Server is up and running on port 9999");
      });
   })
   .catch((err) => {
      console.error("connection to clusterDB failed", err);
   });
