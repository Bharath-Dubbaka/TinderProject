const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { User } = require("./models/user");
const { ReturnDocument } = require("mongodb");
const { validateSignUp, validateLogin } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

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
   console.log("POST called with", req.body);
   try {
      const { firstName, lastName, emailID, password } = req.body;

      //encrypt password before saving
      const passwordHash = await bcrypt.hash(password, 10);
      console.log(passwordHash);
      //calling new instance of user to send data from request... to DB via mongoose
      const user = new User({
         firstName,
         lastName,
         emailID,
         password: passwordHash,
      });
      validateSignUp(req);
      await user.save();
      res.send("user added successfully");
      console.log("user added successfully");
   } catch (err) {
      res.status(400).send("user NOT added :::" + err.message);
      console.log("user NOT added", err.message);
   }
});

app.post("/login", async (req, res) => {
   const tokenSecretKey = process.env.TokenSecretKey;
   try {
      validateLogin(req);
      const { emailID, password } = req.body;
      const validUser = await User.findOne({ emailID: emailID });
      if (!validUser) {
         throw new Error("Wrong ID or Password");
      }
      const isPasswordValid = await bcrypt.compare(
         password,
         validUser.password
      );
      if (isPasswordValid) {
         console.log("Login Successful");

         //creating JWT token with expiry using jwtLibrary
         const token = await jwt.sign({ _id: validUser._id }, "devTinder@123", {
            expiresIn: "1d",
         });

         //sending token via cookie using express.js and also expiring cookies
         res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
         }); // cookie expires after 8 hours

         res.send("Login Successful");
      } else {
         throw new Error("Wrong ID or Password");
      }
   } catch (err) {
      res.status(400).send("Wrong ID or Password :::" + err.message);
      console.log("Wrong ID or Password", err.message);
   }
});

app.get("/profile", userAuth, async (req, res) => {
   const user = req.user;
   console.log("user Match", user);
   res.send(user);
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
   const userFirstName = req.user.firstName;
   console.log("connect req sent by " + userFirstName);
   res.send("connect req sent by " + userFirstName);
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
