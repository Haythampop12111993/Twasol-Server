const mongoose = require("mongoose");
const config = require("config");
// mongoose.connect(process.env.DATABASE_URL || config.get("db"));
const dbConnect = async () => {
  const conn = await mongoose.connect(
    process.env.DATABASE_URL || config.get("db")
  );
  console.log(`MongoDB Connected: SuccessFully At ${conn.connection.host}`);
};
module.exports = dbConnect;
