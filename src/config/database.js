const mongoose = require("mongoose");

const connectDB = async () => {
   await mongoose.connect(
      "mongodb+srv://NamasteyNode:C3i2RPFPbMYnQqcQ@namastenode.xmgw512.mongodb.net/devTinder"
   );
   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};

module.exports = { connectDB };
