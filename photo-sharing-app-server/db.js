const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/photosharingDB";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB !");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
  
module.exports = mongoose;
