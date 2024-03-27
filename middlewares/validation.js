const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const userRegistrationValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "name" field must be filled in',
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
  }),
});

const createClothingItemValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

const userLoginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

// idk
// const userClothingAccess = celebrate({
//   body: Joi.object()
//     .keys({ id: Joi.string.alphanum().length(24).required() })
//     .messages({
//       "string.empty": "The ID must be filled in",
//       "string.hex": "The ID must be a valid hexadecimal",
//     }),
//   //   4. User and clothing item IDs when they are accessed

//   // IDs must be a hexadecimal value length of 24 characters.

//   // i found string.hex for the Joi validation error
// });

// copied from Dot https://discord.com/channels/1078663743568883783/1222324978842734712/1222326382399328317
const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24).messages({
      "string.empty": "The 'userId' field must be filled in",
      "string.length": "The 'userId' field must have a length of 24 characters",
      "string.hex": "The 'userId' must be a hexadecimal string",
    }),
  }),
});

const clothingIdValidation = celebrate({
  params: Joi.object().keys({
    clothingId: Joi.string().required().hex().length(24).messages({
      "string.empty": "The 'clothingId' field must be filled in",
      "string.length":
        "The 'clothingId' field must have a length of 24 characters",
      "string.hex": "The 'clothingId' must be a hexadecimal string",
    }),
  }),
});

module.exports = {
  userRegistrationValidation,
  createClothingItemValidation,
  userLoginValidation,
  // userClothingAccess,
  userIdValidation,
  clothingIdValidation,
};
