const mongoose = require("mongoose");
const validator = require("validator");

const connectionRequestSchema = new mongoose.Schema(
   {
      fromUserID: {
         type: mongoose.Schema.Types.ObjectId, // go deep, why exactly are we using this mongoose types?
         required: true,
      },
      toUserID: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
      },
      status: {
         type: String,
         enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`,
         },
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

//compound indexing queries
connectionRequestSchema.index({ fromUserID: 1, toUserID: 1 });

//using pre to add validation to schema, below helps to check anything.. before/pre running the method "SAVE" first parameter
connectionRequestSchema.pre("save", function (next) {
   const connectionRequest = this;
   //check if fromUser and toUser are same
   if (connectionRequest.fromUserID.equals(connectionRequest.toUserID)) {
      throw new Error("Cannot send connection request to yourself");
   }
   next();
});

const ConnectionRequest = mongoose.model(
   "ConnectionRequest",
   connectionRequestSchema
);

module.exports = { ConnectionRequest };
