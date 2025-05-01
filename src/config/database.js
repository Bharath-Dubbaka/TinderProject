const mongoose = require("mongoose");

const connectDB = async () => {
   //    const dbName = "devTinder";
   //    const uri = `${process.env.MONGODB_URI}${dbName}?retryWrites=true&w=majority`;
   //    await mongoose.connect(uri);

   await mongoose.connect(
      "mongodb+srv://NamasteyNode:C3i2RPFPbMYnQqcQ@namastenode.xmgw512.mongodb.net/devTinder"
   );
};

module.exports = { connectDB };
