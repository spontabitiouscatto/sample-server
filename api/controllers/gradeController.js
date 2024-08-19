const mongoose = require('mongoose');
const gradeModel = require('../models/gradeModel');
const userModel = require('../models/userModel');
const courseModel = require('../models/courseModel');

//view all students with all grades
const view_students_with_grades = async (req, res) => {
    try {
        const grades = await gradeModel.aggregate([
            {
                $lookup: {
                    from: 'users', //find + extract from collection
                    localField: 'student',
                    foreignField: '_id',
                    as: 'studentDetails'
                }
            },
            {
                $unwind: '$studentDetails'  //flatten the result into smaller documents
            },
            {
                $lookup: {
                    from: 'courses', 
                    localField: 'course',
                    foreignField: '_id',
                    as: 'courseDetails'
                }
            },
            {
                $unwind: '$courseDetails'
            },
            {
                $project: {
                    _id: 0,
                    studentName: {
                        $concat: ['$studentDetails.firstname', ' ', '$studentDetails.lastname']
                    },
                    courseName: '$courseDetails.name',
                    grade: '$grade'
                }
            }
        ]);

        res.json(grades);
    } catch (err) {
        res.send(err);
    }
};

const view_grades_of_course = async (req, res) => {
    try {
        const courseId = req.params.courseId; // the route has param courseid
        console.log('Course ID:', courseId);

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }

        const grades = await gradeModel.find({ course: courseId })
            .populate({
                path: 'student', // ref to the field
                model: 'users', // model in userModel.js
                select: 'firstname lastname'
            })
            .populate({
                path: 'course',
                model: 'courses',
                select: 'name' 
            });

        res.json(grades);
    } catch (err) {
        console.error('Error in view_grades_of_course:', err);
        res.status(500).send(err);
    }
};

const add_a_grade = async (req, res) => {
    try {
        const grade = req.body;
        const student = await userModel.findById(studentId);

        if (!student || student.role !== 'student') {
            return res.status(400).json({ message: 'Invalid student or user is not a student' });
        }
        
        await gradeModel.create(grade);
        res.json({ message: "Add new grade succeed!" });
    } catch (err) {
        res.send(err);
    }
};

const update_a_grade = async (req, res) => {
    try {
        const id = req.params.gradeId;
        const grade = req.body; // Ensure this contains the new grade value
        
        // Validate input
        if (!grade.grade) {
            return res.status(400).json({ message: 'Grade is required' });
        }

        const updatedGrade = await gradeModel.findByIdAndUpdate(id, grade, { new: true }); // { new: true } returns the updated document
        if (!updatedGrade) {
            return res.status(404).json({ message: 'Grade not found' });
        }

        res.json({ message: 'Update grade succeed!', updatedGrade });
    } catch (err) {
        console.error('Error in update_a_grade:', err);
        res.status(500).send(err);
    }
};

const view_grades_of_student = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is required' });
        }

        const grades = await gradeModel.find({ student: studentId }).populate('course', 'name');
        res.json(grades);
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports = {
    add_a_grade,
    update_a_grade,
    view_students_with_grades,
    view_grades_of_course,
    view_grades_of_student
};
