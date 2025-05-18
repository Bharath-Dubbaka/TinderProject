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

module.exports = { requestRouter };
