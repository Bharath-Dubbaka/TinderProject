const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");
const { ReturnDocument } = require("mongodb");

app.use(express.json());

app.get("/feed", async (req, res) => {
   console.log("GET feed called", req.body);
   const users = await User.find(req.body);
   if (users?.length === 0) {
      res.status(404).send("No Users Found with given email", res.body);
   } else {
      console.log(users);
      res.send(users);
   }
});

app.delete("/user", async (req, res) => {
   const _id = req.body.userID;

   try {
      await User.findByIdAndDelete({ _id: _id });
      res.send("Deleted user successfully", _id);
      console.log("Deleted user successfully", _id);
   } catch (err) {
      res.status(400).send("delete NOT done :::" + err.message);
      console.log("delete NOT done", err.message);
   }
});

app.patch("/user/:userID", async (req, res) => {
   const userID = req.params?.userID;
   const userData = req.body;

   try {
      const ALLOWED_UPDATES = [
         "userID",
         "skills",
         "age",
         "gender",
         "photoUrl",
         "about",
      ];

      const isUpdateAllowed = Object.keys(userData).every((k) => {
         const allowed = ALLOWED_UPDATES.includes(k);
         return allowed; // <-- This line is essential
      });

      if (!isUpdateAllowed) {
         console.log(isUpdateAllowed, "isUpdateAllowed");
         throw new Error("Update not allowed, due to extra/unwanted fields");
      }

      if (userData?.skills?.length > 10) {
         throw new Error("Only 10 skills allowed");
      }
      const newData = await User.findByIdAndUpdate({ _id: userID }, userData, {
         returnDocument: "after",
         runValidators: true,
      });
      console.log(newData, "newData");
      res.send("User updated successfully");
   } catch (err) {
      res.status(400).send("update NOT done :::" + err.message);
      // console.log("update NOT done", err.message);
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
      console.log("user added successfully");
   } catch (err) {
      res.status(400).send("user NOT added :::" + err.message);
      console.log("user NOT added", err.message);
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
