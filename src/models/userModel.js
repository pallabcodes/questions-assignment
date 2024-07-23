const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { emailRegex, passwordRegex } = require('../utils/regex-patterns');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return emailRegex.test(value);
        },
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      trim: true,
      minlength: [6, 'Password must be at least six characters'],
      validate: {
        validator: function (value) {
          return passwordRegex.test(value);
        },
        message:
          'Password must contain at least one digit, one uppercase letter, and one special character',
      },
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
      default: 'male',
    },
    age: {
      type: Number,
      required: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    accountStatus: {
      type: String,
      enum: [
        'pending',
        'approved',
        'request-for-deletion',
        'suspended',
        'deleted',
      ],
      default: 'approved',
    },
  },
  { timestamps: true }
);

// Instance method to compare passwords ( & this can be used on this model's instance  )
UserSchema.methods.comparePassword = async function (rawPassword) {
  return await bcrypt.compare(rawPassword, this.password);
};

// Instance method ( & this will be on this model's instance )

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    /* using next() will end the code execution of this middleware & goto next middleware (if any) but I used return for readability */
    return next();
  } catch (e) {
    return next(new Error('Password hashing error occurred'));
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
