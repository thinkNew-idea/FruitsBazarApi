const express = require("express");
const app = express();
const apis = require("./src/routes/apis");
require("./src/db/connect");
app.use(express.json());
app.use("/api", apis);
app.get("/",(req,res)=>{
res.send('Apis running sucessfully !!');
})
const port = parseInt(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);

});
