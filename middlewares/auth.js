// middleware/auth.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_ERROR } = require("../utils/errors");

module.exports = (req, res, next) => {
  // get authorization from the header by destructuring
  const { authorization } = req.headers;

  // check that the header exists and starts with 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("something here 1");
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Authorization required" });
  }

  // auth header exists and is in correct format
  // so extract the token from the header
  const token = authorization.replace("Bearer ", "");

  // if token is verified, save the payload
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // otherwise, return an error
    console.log("something here 2");
    console.log("token", token);
    console.log("JWT_SECRET", JWT_SECRET);
    return res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: "Authorization required" });
  }

  /* Save payload to request. This makes the payload available
   to the latter parts of the route. See the `Accessing user
   data with req.user` example for details. */
  req.user = payload;

  // sending the request to the next middleware
  return next();
};
