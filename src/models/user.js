const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: true,
         minLength: 4,
         maxLength: 20,
      },
      lastName: {
         type: String,
      }, // String is shorthand for {type: String}
      emailID: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
         validate(value) {
            if (!validator.isEmail(value)) {
               console.log("This is not a valid email");
               throw new Error("This is not a valid email");
            }
         },
      },
      password: {
         type: String,
         required: true,
         minLength: 8,
         validate(value) {
            if (!validator.isStrongPassword(value)) {
               console.log("Provide strong or valid password");
               throw new Error("Provide strong or valid password");
            }
         },
      },
      age: {
         type: String,
         min: 18,
      },
      gender: {
         type: String,
         lowercase: true,
         validate(value) {
            if (!["male", "female", "others"].includes(value)) {
               console.log("This is not a valid gender");
               throw new Error("This is not a valid gender");
            }
         },
      },
      photoUrl: {
         type: String,
         default:
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
         validate(value) {
            if (!validator.isURL(value)) {
               console.log("This is not a valid URI/URL");
               throw new Error("This is not a valid URI/URL");
            }
         },
      },
      about: {
         type: String,
         minLength: 3,
         maxLength: 80,
         default: "Hi there, Iam using whatsapp",
      },
      skills: {
         type: [String],
      },
   },
   {
      timestamps: true,
   }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
