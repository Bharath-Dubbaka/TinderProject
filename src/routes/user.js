const mongoose = require("mongoose");
const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { User } = require("../models/user");
const { validateEditProfileData } = require("../utils/validate");
const { ConnectionRequest } = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
   try {
      const loggedInUser = req.user; // coming from middleware

      const connectionRequest = await ConnectionRequest.find({
         toUserID: loggedInUser._id,
         status: "interested",
      }).populate("fromUserID", [
         "firstName",
         "lastName",
         "photoUrl",
         "age",
         "about",
         "gender",
         "skills",
      ]);
    

      res.json({
         message: "Data fetched successfully",
         data: connectionRequest,
      });
      console.log(connectionRequest, "connectionRequest");
      console.log(loggedInUser, "loggedInUser");
      // res.json({
      //    message: "data fetched successfully",
      //    data: data,
      // });
   } catch (err) {
      res.status(400).send(" data NOT fetched :::" + err.message);
      console.log(" data NOT fetched", err.message);
   }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
   try {
      const loggedInUser = req.user;

      const connectionRequests = await ConnectionRequest.find({
         $or: [
            { toUserID: loggedInUser._id, status: "accepted" },
            { fromUserID: loggedInUser._id, status: "accepted" },
         ],
      })
         .populate("fromUserID", [
            "firstName",
            "lastName",
            "photoUrl",
            "age",
            "about",
            "gender",
            "skills",
         ])
         .populate("toUserID", [
            "firstName",
            "lastName",
            "photoUrl",
            "age",
            "about",
            "gender",
            "skills",
         ]);

      console.log(connectionRequests);

      const data = connectionRequests.map((row) => {
         if (row.fromUserID._id.toString() === loggedInUser._id.toString()) {
            return row.toUserID;
         }
         return row.fromUserID;
      });

      res.json({ data });
   } catch (err) {
      res.status(400).send({ message: err.message });
   }
});

userRouter.get("/feed", userAuth, async (req, res) => {
   try {
      const loggedInUser = req.user; // coming from middleware
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;

      //all users
      // except: previously ignored "by" loggedInUser
      // except: previously interested "by" loggedInUser
      // except: already connected/accepted profiles
      // except: profiles which ignored "the" loggedInUser
      // except: his own loggedInUser profile

      const connectionRequest = await ConnectionRequest.find({
         $or: [
            { fromUserID: loggedInUser._id },
            { toUserID: loggedInUser._id },
         ],
      }).select("fromUserID toUserID");

      const hideUsersFromFeed = new Set();

      connectionRequest.forEach((req) => {
         hideUsersFromFeed.add(req.toUserID.toString());
         hideUsersFromFeed.add(req.fromUserID.toString());
      });
      console.log(hideUsersFromFeed, "hideUsersFromFeed");
      console.log(connectionRequest, "connectionRequest");
      // console.log(connectionRequest, "connectionRequest");
      // console.log(feed, "connectionRequest");
      // console.log(loggedInUser, "loggedInUser");

      const filteredUsers = await User.find({
         //Array.from(hideUsersFromFeed) to convert from Set to array
         $and: [
            { _id: { $nin: Array.from(hideUsersFromFeed) } },
            { _id: { $ne: loggedInUser._id } },
         ],
      })
         .select("firstName lastName photoUrl age about gender")
         .skip(skip)
         .limit(limit);

      res.json({
         message: "feed fetched successfully",
         data: filteredUsers,
      });
   } catch (err) {
      res.status(400).send(" feed NOT fetched :::" + err.message);
      console.log(" feed NOT fetched", err.message);
   }
});

module.exports = { userRouter };
