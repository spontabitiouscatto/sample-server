//setting up endpoints for requests
const router = (app) => {
    const GradeController = require('../controllers/gradeController');

    app.route('/grades')
        .post(GradeController.add_a_grade)
        .get(GradeController.view_students_with_grades)


    app.route('/grades/:courseId')
        .get(GradeController.view_grades_of_course)

    app.route('/grades/:gradeId')
        .put(GradeController.update_a_grade)

    app.route('/grades/students/:studentId')
        .get(GradeController.view_grades_of_student);

};
module.exports = router;
