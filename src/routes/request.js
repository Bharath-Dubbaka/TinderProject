const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
   try {
      const userFirstName = req.user.firstName;
      console.log("connect req sent by " + userFirstName);
      res.send("connect req sent by " + userFirstName);
   } catch (error) {
      res.status(400).send(" NOT done :::" + err.message);
      console.log(" NOT done", err.message);
   }
});

module.exports = { requestRouter };
