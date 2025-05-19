const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user");
const { validateEditProfileData } = require("../utils/validate");
const { ConnectionRequest } = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
   try {
      const loggedInUser = req.user; // coming from middleware

      const connectionRequest = await ConnectionRequest.find({
         toUserID: loggedInUser._id,
         status: "interested",
      })
         .populate("fromUserID", [
            "firstName",
            "lastName",
            "photoUrl",
            "age",
            "about",
            "gender",
         ])
         .populate("toUserID", [
            "firstName",
            "lastName",
            "photoUrl",
            "age",
            "about",
            "gender",
         ]);

      const data = connectionRequest.map((req) => {
         if (res.fromUserID._id.toString() === loggedInUser._id.toString()) {
            return res.toUserID;
         }
         return res.fromUserID;
      });

      if (!connectionRequest.length) {
         throw new Error("No Received connection requests found.");
      }

      console.log(connectionRequest, "connectionRequest");
      console.log(loggedInUser, "loggedInUser");
      res.json({
         message: "data fetched successfully",
         data: data,
      });
   } catch (err) {
      res.status(400).send(" data NOT fetched :::" + err.message);
      console.log(" data NOT fetched", err.message);
   }
});

userRouter.get("/user/requests/accepted", userAuth, async (req, res) => {
   try {
      const loggedInUser = req.user; // coming from middleware

      const connectionRequest = await ConnectionRequest.find({
         $or: [
            { fromUserID: loggedInUser._id, status: "accepted" },
            { toUserID: loggedInUser._id, status: "accepted" },
         ],
      }).populate("fromUserID", [
         "firstName",
         "lastName",
         "photoUrl",
         "age",
         "about",
         "gender",
      ]);

      if (!connectionRequest.length) {
         throw new Error("No Accepted connection requests found.");
      }

      console.log(connectionRequest, "connectionRequest");
      console.log(loggedInUser, "loggedInUser");
      res.json({
         message: "data fetched successfully",
         data: connectionRequest,
      });
   } catch (err) {
      res.status(400).send(" data NOT fetched :::" + err.message);
      console.log(" data NOT fetched", err.message);
   }
});

module.exports = { userRouter };
