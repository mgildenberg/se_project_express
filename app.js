const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
// const errorHandler = require("./middlewares/error-handler");
const { errorHandler } = require("./middlewares/error-handler");
const { errors } = require("celebrate");

mongoose.set("strictQuery", true); // doing this to suppress warning that comes up everytime

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());

app.use("/", mainRouter);

//Sprint 15 addition
app.use(errors());
//Sprint 15 addition

// Sprint 15 addition
app.use(errorHandler);
// Sprint 15

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
