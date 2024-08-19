//structure of collection
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
   {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      birthday: { type: Date, required: true },
      role: { type: String, required: true, enum: ['student', 'admin', 'teacher'] },
      courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }],
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true }
   },
   {
      versionKey: false // Ignore version key for new data
   }
);

//model link with users collection
const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
