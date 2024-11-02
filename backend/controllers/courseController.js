// const Course = require("../models/Course");

// exports.getAllCourses = async (req, res) => {
//     try {
//         const courses = await Course.find();
//         res.json(courses);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.getCourseById = async (req, res) => {
//     try {
//         const course = await Course.findById(req.params.id);
//         if (!course) {
//             return res.status(404).json({ message: "Course not found" });
//         }
//         res.json(course);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.createCourse = async (req, res) => {
//     try {
//         const newCourse = new Course(req.body);
//         await newCourse.save();
//         res.status(201).json({
//             message: "Course created Successfully",
//         });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.updateCourse = async (req, res) => {
//     try {
//         const updatedCourse = await Course.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );
//         if (!updatedCourse) {
//             return res.status(404).json({ message: "Course not found" });
//         }
//         res.json({
//             message: "Course details Updated!"
//         });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.deleteCourse = async (req, res) => {
//     try {
//         const findCourse = await Course.findOne({ name: req.params.name });

//         if (!findCourse) {
//             return res.status(404).json({ message: "Course not found" });
//         }

//         const deletedCourse = await Course.findByIdAndDelete(findCourse._id);
//         if (!deletedCourse) {
//             return res.status(404).json({ message: "Course not found" });
//         }

//         res.json({ message: "Course deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
const connection = require("../utils/db");

exports.getAllCourses = async (req, res) => {
    try {
        const [courses] = await connection.promise().query('SELECT * FROM course');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const [course] = await connection.promise().query('SELECT * FROM course WHERE id = ?', [req.params.id]);
        if (course.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course[0]); // Return the first course object
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { name } = req.body; // Assuming name is the only required field
        const [result] = await connection.promise().query('INSERT INTO course (name) VALUES (?)', [name]);
        
        res.status(201).json({
            message: "Course created successfully",
            courseId: result.insertId, // Return the ID of the created course
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { name } = req.body; // Assuming name is the only field being updated
        const [result] = await connection.promise().query('UPDATE course SET name = ? WHERE id = ?', [name, req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({
            message: "Course details updated!"
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const [result] = await connection.promise().query('DELETE FROM course WHERE name = ?', [req.params.name]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
