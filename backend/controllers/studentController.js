const connectDB = require('../utils/db');

exports.getAllStudents = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { rows: students } = await client.query('SELECT * FROM students');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.getStudentById = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { rows: students } = await client.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
        if (students.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(students[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.createStudent = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { name, password, email, course } = req.body;
        const { rows } = await client.query('INSERT INTO students (name, password, email, course) VALUES ($1, $2, $3, $4) RETURNING id', [name, password, email, course]);
        res.status(201).json({ message: "Student created successfully", id: rows[0].id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.updateStudent = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { name, password, email, course } = req.body; // Extract fields to be updated
        const { rowCount } = await client.query('UPDATE students SET name = $1, password = $2, email = $3, course = $4 WHERE id = $5', [name, password, email, course, req.params.id]);
        if (rowCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student details updated!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.deleteStudent = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { rowCount } = await client.query('DELETE FROM students WHERE email = $1', [req.params.email]);
        if (rowCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.updateAttendance = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        
        const updates = req.body;
        if (!Array.isArray(updates)) {
            throw new Error('Updates must be an array');
        }

        const bulkOperations = updates.map(update => {
            return client.query('UPDATE students SET attendance = attendance + $1 WHERE id = $2', [update.attendanceCount, update.studentId]);
        });

        await Promise.all(bulkOperations);
        res.json({ message: "Attendance updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.totalAttendance = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { updatedCount } = req.body; // Assuming you are passing the count to update
        const { rowCount } = await client.query('UPDATE attendance SET count = $1 WHERE id = $2', [updatedCount, "662b3c2219a7f45154c025bb"]); // Adjust the id based on your context
        if (rowCount === 0) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        res.json({ updatedAttendance: req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};
