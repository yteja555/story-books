const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionString = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@cluster0.vivo5.gcp.mongodb.net/storybook?retryWrites=true&w=majority`;
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(555);
  }
};

module.exports = connectDB;
