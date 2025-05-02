const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");

app.use(express.json());

app.get("/feed", async (req, res) => {
   console.log("GET feed called", req.body);
   const users = await User.find(req.body);
   if (users.length === 0) {
      res.status(404).send("No Users Found with given email", res.body);
   } else {
      console.log(users);
      res.send(users);
   }
});

app.post("/signup", async (req, res) => {
   console.log("POST called", req.body);
   //calling new instance of user to send data to DB via mongoose
   // const user = new User({
   //    firstName: "brat",
   //    lastName: "bratName",
   //    emailID: "brat@g.com",
   //    password: "bratPass",
   // });

   //calling new instance of user to send data from request... to DB via mongoose
   const user = new User(req.body);
   try {
      await user.save();
      res.send("user added successfully");
   } catch (err) {
      res.status(400).send("user NOT added successfully");
   }
});

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
