const validator = require("validator");

function validateSignUp(req) {
   const { firstName, lastName, emailID, password } = req.body;
   if (!firstName || !lastName) {
      throw new Error("Enter validate names");
   }
   if (!validator.isEmail(emailID)) {
      throw new Error("Enter validate email");
   }
   if (!validator.isStrongPassword(password)) {
      throw new Error("Enter validate password");
   }
}

function validateLogin(req) {
   const { emailID, password } = req.body;
   if (!validator.isEmail(emailID)) {
      throw new Error("Enter validate email");
   }
   if (!validator.isStrongPassword(password)) {
      throw new Error("Enter validate password");
   }
}

function validateEditProfileData(req) {
   const userID = req.user._id;
   const userData = req.body;
   try {
      const ALLOWED_UPDATES = ["skills", "age", "gender", "photoUrl", "about"];

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
   } catch (error) {
      console.log("Enter valid Data to edit");

      throw new Error("Enter valid Data to edit");
   }
}

module.exports = { validateSignUp, validateLogin, validateEditProfileData };
