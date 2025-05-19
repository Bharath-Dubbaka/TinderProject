const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user");
const { validateEditProfileData } = require("../utils/validate");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
   try {
      const user = req.user; // coming from middleware
      console.log("user Match", user);
      res.send(user);
   } catch (err) {
      res.status(400).send(" NOT done :::" + err.message);
      console.log(" NOT done", err.message);
   }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
   const userID = req.user._id;
   const userData = req.body;
   console.log(userData, "userDatauserData");
   try {
      //extracted logic to utils
      validateEditProfileData(req);

      const newData = await User.findByIdAndUpdate({ _id: userID }, userData, {
         returnDocument: "after",
         runValidators: true,
      });
      console.log(newData, "newData");
      res.send("User updated successfully");
   } catch (err) {
      res.status(400).send("update NOT done :::" + err.message);
      console.log("update NOT done", err.message);
   }
});

module.exports = { profileRouter };
