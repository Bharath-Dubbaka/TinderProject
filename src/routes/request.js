const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

requestRouter.post(
   "/request/send/:status/:toUserID",
   userAuth,
   async (req, res) => {
      try {
         const fromUserID = req.user._id;
         const toUserID = req.params.toUserID;
         const status = req.params.status;
         const allowedStatus = ["interested", "ignored"];

         const isAllowed = allowedStatus.includes(status);
         if (!isAllowed) {
            throw new Error("Status not valid");
         }

         //check if toUserID does exists in our DB or not
         const validToUserID = await User.findById(toUserID);

         if (!validToUserID) {
            throw new Error("Not a valid toUserID");
         }

         //checking if any connectionRequests exists btw two users
         //throw err if found any A to B or B to A requests
         const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
               { fromUserID: fromUserID, toUserID: toUserID },
               { fromUserID: toUserID, toUserID: fromUserID },
            ],
         });

         if (existingConnectionRequest) {
            throw new Error("ConnectionRequest Already Exists");
         }
         //calling new instance of connectRequest to send data from request... to DB via mongoose
         const connectionRequest = new ConnectionRequest({
            fromUserID,
            toUserID,
            status,
         });
         const data = await connectionRequest.save();
         console.log(
            req.user.firstName +
               " is " +
               status +
               " in " +
               validToUserID.firstName
         );
         res.json({
            message:
               req.user.firstName +
               " is " +
               status +
               " in " +
               validToUserID.firstName,
            data,
         });
      } catch (err) {
         res.status(400).send("Request NOT sent :::" + err.message);
         console.log("Request NOT sent", err.message);
      }
   }
);

requestRouter.post(
   "/request/review/:status/:requestID",
   userAuth,
   async (req, res) => {
      try {
         const loggedInUser = req.user._id;
         const loggedInUserFirstName = req.user.firstName;
         const { status, requestID } = req.params;
         const allowedStatus = ["accepted", "rejected"];

         const isAllowed = allowedStatus.includes(status);
         if (!isAllowed) {
            throw new Error("Status not valid");
         }

         //check if toUserID does exists in our DB or not
         const connectionRequest = await ConnectionRequest.findOne({
            _id: requestID,
            toUserID: loggedInUser,
            status: "interested",
         });

         if (!connectionRequest) {
            throw new Error("Connection Request Not found");
         }

         connectionRequest.status = status;
         const data = await connectionRequest.save();

         console.log(
            loggedInUserFirstName + " is " + status + " in " + data.fromUserID,
            data
         );
         res.json({
            message:
               loggedInUserFirstName +
               " is " +
               status +
               " in " +
               data.fromUserID,
            data,
         });
      } catch (err) {
         res.status(400).send("Request NOT Found :::" + err.message);
         console.log("Request NOT Found", err.message);
      }
   }
);

module.exports = { requestRouter };
