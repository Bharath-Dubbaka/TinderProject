const express = require("express");
const authRouter = express.Router();

const { User } = require("../models/user");
const { validateSignUp, validateLogin } = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", userAuth, async (req, res) => {
   try {
      //OWN APPROACH
      //   const user = req.user;
      //   //check if user is logged in or not
      //   if (!user) {
      //      throw new Error("No user found");
      //   }
      //   //logged in ?
      //   //clear the token and refresh/redirect the page
      //   res.clearCookie("token");
      //   res.send("token deleted and logged out successfully");

      //Akshay approach
      res.cookie("token", null, {
         expires: new Date(Date.now()),
      });
      res.send("token deleted and logged out successfully");
   } catch (err) {
      //logged out already?
      res.status(400).send("Cannot logout :::" + err.message);
      console.log("Cannot logout", err.message);
   }
});

module.exports = { authRouter };
