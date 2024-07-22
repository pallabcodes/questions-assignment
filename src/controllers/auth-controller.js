const { User, UserToken } = require('../models');
const { parseValidationErrors } = require('../utils/formatters');
const { generateNewTokens } = require('../utils/helpers');
const { registerSchema, loginSchema } = require('../validators/auth');
const mongoose = require('mongoose');

const register = async function (req, res, next) {
  try {
    // 0. validate / sanitize payload
    const user = await registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // 1. check if this email already exist along with below accountStatus
    const existingUser = await User.findOne({
      email: user.email.toLowerCase(),
      // accountStatus: {
      //   $in: ['suspended'],
      // },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'This email already exists so try another email' });
    }

    const newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      gender: user.gender,
      age: user.age,
    });

    await newUser.save();

    // 5. Send back a successful message
    res
      .status(201)
      .json({ message: 'Your account has been created successfully' });
  } catch (error) {
    res.status(400).json(parseValidationErrors(error));
  }
};

const login = async function (req, res, next) {
  try {
    // Validate and sanitize payload
    const { email, password } = await loginSchema.validate(req.body, {
      stripUnknown: true,
    });

    // Does this user already exist ?
    const user = await User.findOne({
      email: email.toLowerCase(),
      accountStatus: { $nin: ['deleted', 'request-for-deletion', 'suspended'] },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = await generateNewTokens(user);

    await UserToken.create({
      userId: new mongoose.Types.ObjectId(user._id),
      token: accessToken,
    });

    res.status(200).json({
      message: 'You have successfully authenticated',
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const accessToken = req.headers['authorization']?.split(' ')?.[1];

    await UserToken.deleteOne({ userId: userId, token: accessToken });

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
};
