const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://Prabhash:Prabhash@cluster0.dwtij59.mongodb.net/FruitsBazar',{
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  waitQueueTimeoutMS: 60000,
})
  .then(() => {
    console.log("connection is successful");
  })
  .catch((e) => {
    console.log("No connection");
  });
