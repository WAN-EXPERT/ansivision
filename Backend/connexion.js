const mongoose = require("mongoose");
//require("dotenv").config();
const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

//mongoDB client
const uri = "mongodb+srv://ljerome:ufugvSGXzqJ84AD@cluster0.fesfk.mongodb.net/networks?retryWrites=true&w=majority";

const connexion = mongoose
  .connect(uri, connectionParams)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });


module.exports = connexion;