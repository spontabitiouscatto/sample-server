//structure of collection
const mongoose = require('mongoose');

const gradeSchema = mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
        grade: { type: Number, min: 0, max: 100 }
    },
    {
        versionKey: false  // ignore version key for new data
    }
);
//model link with grades collection
const gradeModel = mongoose.model('grades', gradeSchema);
module.exports = gradeModel;
