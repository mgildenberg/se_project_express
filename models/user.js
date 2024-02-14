const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator: function validateURL(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function validateEmail(value) {
        return validator.isEmail(value);
        // I must also check for uniqueness. Required: Each user's email must be unique and validated against the email schema.
      },
      message: "You must enter a valid email",
    },
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("user", userSchema);
