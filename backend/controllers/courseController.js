const connectDB = require("../utils/db");

exports.getAllCourses = async (req, res) => {
    let connection;
    try {
        connection = await connectDB(); // Establish the connection
        const [courses] = await connection.promise().query('SELECT * FROM course');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    let connection;
    try {
        connection = await connectDB(); // Establish the connection
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
    let connection;
    try {
        connection = await connectDB(); // Establish the connection

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
    let connection;
    try {
        connection = await connectDB(); // Establish the connection

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
    let connection;
    try {
        connection = await connectDB(); // Establish the connection

        const [result] = await connection.promise().query('DELETE FROM course WHERE name = ?', [req.params.name]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
