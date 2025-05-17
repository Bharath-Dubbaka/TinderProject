const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {
   try {
      const { token } = req.cookies;
      if (!token) {
         throw new Error("Token not valid, try logging in");
      }
      const decodedMessage = await jwt.verify(token, "devTinder@123");
      const _id = decodedMessage;
      const user = await User.findById(_id);

      if (!user) {
         throw new Error("No user found");
      }
      // attaching found user in req, so next handler make use of it
      req.user = user;
      next();

      //    console.log("token", token);
      //    console.log("decodedMessage", decodedMessage);

      //    console.log("tokenId", _id);
      //    console.log("user Match", user);

      //Move to next function handler
   } catch (err) {
      res.status(400).send("ERR:" + err.message);
   }
};

module.exports = { userAuth };
