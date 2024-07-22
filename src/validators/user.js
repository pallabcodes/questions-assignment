const yup = require('yup');

// Schema for updating user information (excluding email and password)
const updateUserSchema = yup.object().shape({
  firstName: yup.string().trim().notRequired(),
  lastName: yup.string().trim().notRequired(),
  avatar: yup.string().trim().notRequired(),
});

module.exports = {
  updateUserSchema,
};
