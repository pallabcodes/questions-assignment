const mongoose = require('mongoose');

const UserTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, required: true },
});

const UserToken = mongoose.model('UserToken', UserTokenSchema);

module.exports = UserToken;
