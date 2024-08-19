const courseModel = require('../models/courseModel')

const view_all_courses = async (req, res) => {
    try {
        const courses = await courseModel.find().populate('teachers', 'firstname lastname');
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
}

const User = require('../models/userModel');
const Grade = require('../models/gradeModel');

const enroll_in_course = async (req, res) => {
    try {
        console.log(req.session);
        const courseId = req.params.id; // Get courseId from URL parameters
        const sessionUser = req.body; // current user data
        console.log(sessionUser);

        if (!sessionUser) {
            return res.status(401).json({ message: 'User not logged in' });
        }

        // Retrieve the user from the database using the ID from the sessionUser
        const user = await User.findById(sessionUser._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userRole = user.role;

        // Find the course by ID
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Enroll the user in the course based on role
        if (userRole === 'student') {
            if (!course.students.includes(user._id)) {
                course.students.push(user._id);

                // Create a new grade entry for the student
                const newGrade = new Grade({
                    student: user._id,
                    course: courseId,
                    grade: 0 // Or a default value like 0
                });
                await newGrade.save();
            } else {
                return res.status(400).json({ message: 'User already enrolled as student' });
            }
        } else if (userRole === 'teacher') {
            if (!course.teachers.includes(user._id)) {
                course.teachers.push(user._id);
            } else {
                return res.status(400).json({ message: 'User already enrolled as teacher' });
            }
        } else {
            return res.status(403).json({ message: 'Unauthorized role' });
        }

        // Save the updated course
        await course.save();

        // Add the course to the user's list of courses
        if (!user.courses.includes(courseId)) {
            user.courses.push(courseId);
            await user.save();
        }

        console.log(`User ID: ${user._id} successfully enrolled in course ID: ${courseId}`);
        res.status(200).json({ message: 'Enrollment successful', course });
    } catch (err) {
        console.error('Error in enroll_in_course:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const view_a_course = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`Fetching course with ID: ${id}`);

        const course = await courseModel.findById(id)
            .populate({
                path: 'teachers',
                select: 'firstname lastname'
            })
            .populate({
                path: 'students',
                select: 'firstname lastname'
            });

        if (!course) {
            console.log('Course not found');
            return res.status(404).json({ message: 'Course not found' });
        }

        console.log('Course found:', course);
        res.json(course);
    } catch (err) {
        console.error('Error in view_a_course:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const delete_a_course = async (req, res) => {
    try {
        const courseId = req.params.id;

        // Delete the course
        const deletedCourse = await courseModel.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        // Remove the course from students' and teachers' courses arrays
        const userUpdateResult = await User.updateMany(
            { $or: [{ courses: courseId }, { 'courses.course': courseId }] },
            { $pull: { courses: courseId } }
        );
        
        // Delete all grades related to the course
        const gradeDeleteResult = await Grade.deleteMany({ course: courseId });

        // Log result of grade deletion
        if (gradeDeleteResult.deletedCount === 0) {
            console.log('No grades found for the deleted course');
        } else {
            console.log(`Deleted ${gradeDeleteResult.deletedCount} grades related to course ID: ${courseId}`);
        }

        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        console.error("Error during course deletion:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const add_a_course = async (req, res) => {
    try {
        course = req.body
        await courseModel.create(course)
        //await courseModel.save(course)
        res.json({ message: "Add new course succeed !" })
    } catch (err) {
        res.send(err)
    }
}

const update_a_course = async (req, res) => {
    try {
        id = req.params.id
        course = req.body
        await courseModel.findByIdAndUpdate(id, course)
        res.json({ message: "Update course succeed !" })
    } catch (err) {
        res.send(err)
    }
}

module.exports = {
    view_all_courses,
    add_a_course,
    view_a_course,
    update_a_course,
    delete_a_course,
    enroll_in_course
}