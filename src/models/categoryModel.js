const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Middleware to convert the name to lowercase before saving
CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.name = this.name.toLowerCase();
  }
  next();
});

// Middleware to convert the name to lowercase before updating
CategorySchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.name = update.name.toLowerCase();
  } else if (update.$set && update.$set.name) {
    update.$set.name = update.$set.name.toLowerCase();
  }
  next();
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
