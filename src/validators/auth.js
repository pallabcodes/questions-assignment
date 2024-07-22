const yup = require('yup');
const { emailRegex, passwordRegex } = require('../utils/regex-patterns');

// Schema for user registration
const registerSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .matches(emailRegex, 'Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .matches(
      passwordRegex,
      'Password must contain at least one digit, one uppercase letter, and one special character'
    )
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  gender: yup
    .string()
    .required()
    .oneOf(['male', 'female', 'others'], 'Invalid gender'),
  avatar: yup.string().optional(),
  mobile: yup.string().optional(),
});

// Schema for user login
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, 'Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .matches(
      passwordRegex,
      'Password must contain at least one digit, one uppercase letter, and one special character'
    )
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
};
