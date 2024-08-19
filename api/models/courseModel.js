//structure of collection
const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }], 
        teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }] 
    },
    {
        versionKey: false // Ignore version key for new data
    }
);
//model link with courses collection
const courseModel = mongoose.model('courses', courseSchema);
module.exports = courseModel;
