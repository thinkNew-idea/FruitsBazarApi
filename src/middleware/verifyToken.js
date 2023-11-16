const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
   const authHeader = req?.headers['authorization']?.replace('Bearer ', '');
   if (authHeader==undefined ||authHeader==null) {
      const error = res.status(500).send(
         {
            error: "authentication Error!",
            message: "Not authenticated!",
         }
      );
      throw error;
   }
   let decodedToken;
   try {
      decodedToken = jwt.verify(authHeader, 'secret');
   } catch (err) {
      err.statusCode = 500;
      throw err;
   }
   if (!decodedToken) {
      const error = res.status(500).send(
         {
            error: "authentication Error!",
            message: "Not authenticated!",
         }
      );
      throw error;
   }
   next();
};
