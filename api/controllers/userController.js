const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Login User
const login_user = async (req, res) => {
   const { email, password } = req.body;

   try {
      // Verify existing email
      const user = await User.findOne({ email: email });
      if (!user) {
         return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare the input password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({ message: 'Invalid email or password' });
      }

      res.status(200).json({
         message: 'Login successful',
         status: "success",
         user: user
      });
   } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
   }
};

// Add a new user (signup)
const add_an_user = async (req, res) => {
   try {
      const { firstname, lastname, birthday, role, email, password } = req.body;

      // Check if the email already exists
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
         return res.status(400).json({ message: 'Email already in use' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
         firstname,
         lastname,
         birthday,
         role,
         email,
         password: hashedPassword
      });

      // Save the user to the database
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
   } catch (err) {
      res.status(500).json({ message: 'An error occurred', error: err.message });
   }
};

// View all users
const view_all_users = async (req, res) => {
   try {
      //store all users
      const users = await User.find({});
      res.json(users);
   } catch (err) {
      res.status(500).json({ message: 'An error occurred', error: err.message });
   }
};

// View a specific user by ID
const view_an_user = async (req, res) => {
   try {
      //get id from url
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
   } catch (err) {
      res.status(500).json({ message: 'An error occurred', error: err.message });
   }
};

//delete user by id
const Grade = require('../models/gradeModel');
const Course = require('../models/courseModel');
const delete_an_user = async (req, res) => {
   try {
      const userId = req.params.id;
      // Delete the user from the users collection
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Delete all grade collection objects that have this user ID
      await Grade.deleteMany({ student: userId });

      // Remove the user from the students or teachers array in the course collection
      await Course.updateMany(
         //multiple conditions
         { $or: [{ students: userId }, { teachers: userId }] },
         //remove from array
         { $pull: { students: userId, teachers: userId } }
      );

      res.json({ message: 'User and associated data deleted successfully' });
   } catch (err) {
      console.error('Error in delete_an_user:', err);
      res.status(500).json({ message: 'An error occurred', error: err.message });
   }
};

const update_an_user = async (req, res) => {
   try {
      const id = req.params.id;
      const user = req.body;
      //get the data after the update, not before with new=true
      const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
      if (!updatedUser) {
         return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User updated successfully', user: updatedUser });
   } catch (err) {
      res.status(500).json({ message: 'An error occurred', error: err.message });
   }
};

const update_password = async (req, res) => {
   try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(id);
      if (!user) {
         return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Check if the current password matches
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
         return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      // Hash the new password with 10 rounds of salt
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password
      user.password = hashedPassword;
      await user.save();

      res.json({ success: true, message: 'Password updated successfully' });
   } catch (err) {
      res.status(500).json({ success: false, message: 'An error occurred', error: err.message });
   }
};

// View users with an optional role filter
const view_users_with_role = async (req, res) => {
   try {
      const role = req.params.role;
      if (!role) {
         return res.status(400).json({ message: 'Role parameter is required' });
      }

      if (!['student', 'admin', 'teacher'].includes(role)) {
         return res.status(400).json({ message: 'Invalid role parameter' });
      }
      //find item in array to ref an object, get name
      const users = await User.find({ role }).populate('courses', 'name');
      res.json(users);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

module.exports = {
   view_all_users,
   add_an_user,
   view_an_user,
   update_an_user,
   delete_an_user,
   login_user,
   view_users_with_role,
   update_password
};
