//setting up endpoints for requests
const router = (app) => {
   const UserController = require('../controllers/userController');

   app.route('/users')
      .get(UserController.view_all_users) // View all users
      .post(UserController.add_an_user)  // Add a new user (signup)

   app.route('/users/:id')
      .get(UserController.view_an_user)  // View a specific user by ID
      .put(UserController.update_an_user) // Update a specific user by ID
      .delete(UserController.delete_an_user); // Delete a specific user by ID

   app.route('/users/role/:role')
      .get(UserController.view_users_with_role); // View users by specific role

   app.route('/users/login')
      .post(UserController.login_user);  // Login user

   app.route('/users/:id/password')
      .put(UserController.update_password);
};

module.exports = router;
