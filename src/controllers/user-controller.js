const mongoose = require('mongoose');
const { User } = require('../models');
const { updateUserSchema } = require('../validators/user');

const getUserProfile = async function (req, res, next) {
  const userId = req.user._id;

  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        gender: 1,
        avatar: {
          $cond: {
            if: { $or: [{ $eq: ['$avatar', ''] }, { $eq: ['$avatar', null] }] },
            then: '',
            else: { $concat: [process.env.SERVER_URL, '/', '$avatar'] },
          },
        },
        mobile: 1,
        accountStatus: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $project: {
        password: 0,
        __v: 0,
      },
    },
  ];

  try {
    const user = await User.aggregate(pipeline);

    if (!user?.[0]) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ data: user[0] });
  } catch (error) {
    next(error);
  }
};

// including the profile picture
const updateUserProfile = async (req, res, next) => {
  try {
    // Validate request body against updateUserSchema
    const updateData = await updateUserSchema.validate(req.body, {
      stripUnknown: true,
    });

    // If a new file is uploaded, update the avatar path
    if (req.file) {
      updateData.avatar = req.file.path.replace(/\\/g, '/');
    }

    // Find and update user by ID
    await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    // Return the updated user
    res.status(200).json({ message: 'User has successfully updated!' });
  } catch (error) {
    next(error);
  }
};

const deleteUserAccount = async function (req, res, next) {
  const userId = req.user?._id;

  try {
    // Perform a single update operation with conditional logic
    await User.findOneAndUpdate(
      {
        _id: userId,
      },
      { $set: { accountStatus: 'request-for-deletion' } },
      { new: true, upsert: false }
    );

    res.status(200).json({ message: 'Your account will be deleted shortly' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
};
