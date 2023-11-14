const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://Prabhash:Prabhash@cluster0.dwtij59.mongodb.net/FruitsBazar')
  .then(() => {
    console.log("connection is successful");
  })
  .catch((e) => {
    console.log("No connection");
  });
