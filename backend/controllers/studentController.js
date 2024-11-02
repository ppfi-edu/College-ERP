const connectDB = require('../utils/db'); // Assume you have a utility for database connection

exports.getAllStudents = async (req, res) => {
    let connection;
    try {
        connection = await connectDB(); // Establish the connection
        const [students] = await connection.promise().query('SELECT * FROM students'); // Replace with appropriate fields
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStudentById = async (req, res) => {
    let connection;
    try {
        connection = await connectDB(); // Establish the connection
        const [students] = await connection.promise().query('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (students.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(students[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStudent = async (req, res) => {
    let connection;
    try {
        connection = await connectDB(); // Establish the connection
        const { name, password, email, course } = req.body;
        const result = await connection.promise().query('INSERT INTO students (name, password, email, course) VALUES (?, ?, ?, ?)', [name, password, email, course]);
        res.status(201).json({ message: "Student created Successfully", id: result[0].insertId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    let connection;
    try {
        connection = await connectDB(); // Establish the connection
        const result = await connection.promise().query('UPDATE students SET ? WHERE id = ?', [req.body, req.params.id]);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student details Updated!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    let connection;
    try {
        connection = await connectDB(); // Establish the connection
        const result = await connection.promise().query('DELETE FROM students WHERE email = ?', [req.params.email]);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAttendance = async (req, res) => {
    let connection;
    try {
        connection = await connectDB(); // Establish the connection
        
        const updates = req.body;
        if (!Array.isArray(updates)) {
            throw new Error('Updates must be an array');
        }

        const bulkOperations = updates.map(update => {
            return connection.promise().query('UPDATE students SET attendance = attendance + ? WHERE id = ?', [update.attendanceCount, update.studentId]);
        });

        await Promise.all(bulkOperations);
        res.json({ message: "Attendance updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.totalAttendance = async (req, res) => {
    let connection;
    try {
        connection = await connectDB(); // Establish the connection
        const updatedAttendance = await connection.promise().query('UPDATE attendance SET ? WHERE id = ?', [req.body, "662b3c2219a7f45154c025bb"]); // Assuming attendance table has an id column
        if (updatedAttendance[0].affectedRows === 0) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        res.json({ updatedAttendance: req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
