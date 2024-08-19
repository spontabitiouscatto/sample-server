//setting up endpoints for requests
const router = (app) => {
    const CourseController = require('../controllers/courseController')

    app.route('/courses')
        .get(CourseController.view_all_courses)
        .post(CourseController.add_a_course)

    app.route('/courses/:id')
        .get(CourseController.view_a_course)
        .put(CourseController.update_a_course)
        .delete(CourseController.delete_a_course)
    
    app.route('/courses/:id/enroll')
        .post(CourseController.enroll_in_course)
}

module.exports = router