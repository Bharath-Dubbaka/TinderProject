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

module.exports = { validateSignUp };
