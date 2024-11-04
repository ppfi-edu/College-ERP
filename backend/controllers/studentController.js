import connectDB  from '../utils/db.js'; // Import your connectDB utility

export const getAllStudents = async (req, res) => {
    const client = await connectDB(); // Get a client from connectDB
    try {
        const { rows: students } = await client.query('SELECT * FROM Student');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release(); // Release the client back to the pool
    }
};

export const getStudentById = async (req, res) => {
    const client = await connectDB();
    try {
        const { rows: students } = await client.query('SELECT * FROM Student WHERE id = $1', [req.params.id]);
        if (students.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(students[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

export const createStudent = async (req, res) => {
    const client = await connectDB();
    try {
        const { name, password, email, courses, enrollmentYear, branch } = req.body;

        // Generate student_id in the format BT22CSE214
        const rollNumber = Math.floor(100 + Math.random() * 900); // Generates a 3-digit roll number
        const student_id = `BT${enrollmentYear}${branch}${rollNumber}`;

        console.log("DEBUG: Generated student_id:", student_id);
        console.log("DEBUG: Received request data:", { name, email, courses, enrollmentYear, branch });

        const { rows } = await client.query(
            `INSERT INTO Student 
                (student_id, name, password, email, course_id, enrollment_year, branch, roll_number, created_at) 
             VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP) 
             RETURNING student_id`,
            [student_id, name, password, email, courses, enrollmentYear, branch, rollNumber]
        );

        console.log("DEBUG: Insert query result:", rows);

        res.status(201).json({ message: "Student created successfully", student_id: rows[0].student_id });
    } catch (error) {
        console.error("DEBUG: Error during student creation:", error);
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
        console.log("DEBUG: Database client released.");
    }
};


export const updateStudent = async (req, res) => {
    const client = await connectDB();
    try {
        const { name, password, email, course } = req.body; // Extract fields to be updated
        const { rowCount } = await client.query(
            'UPDATE students SET name = $1, password = $2, email = $3, course = $4 WHERE id = $5',
            [name, password, email, course, req.params.id]
        );
        if (rowCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student details updated!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
};

export const deleteStudent = async (req, res) => {
    const client = await connectDB();
    try {
        const { rowCount } = await client.query('DELETE FROM Student WHERE email = $1', [req.params.email]);
        if (rowCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

export const updateAttendance = async (req, res) => {
    const client = await connectDB();
    try {
        const updates = req.body;
        if (!Array.isArray(updates)) {
            throw new Error('Updates must be an array');
        }

        const bulkOperations = updates.map(update => {
            return client.query('UPDATE Student SET attendance = attendance + $1 WHERE id = $2', [update.attendanceCount, update.studentId]);
        });

        await Promise.all(bulkOperations);
        res.json({ message: "Attendance updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

export const totalAttendance = async (req, res) => {
    const client = await connectDB();
    try {
        const { updatedCount } = req.body; // Assuming you are passing the count to update
        const { rowCount } = await client.query('UPDATE attendance SET count = $1 WHERE id = $2', [updatedCount, "662b3c2219a7f45154c025bb"]); // Adjust the id based on your context
        if (rowCount === 0) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        res.json({ updatedAttendance: req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};
