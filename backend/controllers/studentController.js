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
            'UPDATE Student SET name = $1, password = $2, email = $3, course = $4 WHERE id = $5',
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
        const { facultyId, studentId } = req.body;

        // Check if the request contains necessary fields
        if (!facultyId || !studentId) {
            return res.status(400).json({ error: 'Missing facultyId or studentId' });
        }

        // Fetch the student to verify their existence
        const studentQuery = await client.query(
            'SELECT student_id FROM Student WHERE student_id = $1',
            [studentId]
        );

        if (studentQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Fetch the faculty to verify their existence
        const facultyQuery = await client.query(
            'SELECT id FROM Faculty WHERE id = $1',
            [facultyId]
        );

        if (facultyQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        // Check if the attendance record already exists for this student and faculty
        const attendanceQuery = await client.query(
            'SELECT total_attendance, total_classes FROM Attendance WHERE student_id = $1 AND faculty_id = $2',
            [studentId, facultyId]
        );

        if (attendanceQuery.rows.length === 0) {
            // If attendance record doesn't exist, create a new record
            await client.query(
                'INSERT INTO Attendance (faculty_id, student_id, total_attendance, total_classes, att_percentage) VALUES ($1, $2, $3, $4, $5)',
                [facultyId, studentId, 1, 1, 100] // Mark attendance as present (1 attendance in total)
            );

            return res.json({
                message: 'Attendance marked as present successfully',
                totalAttendance: 1,
                totalClasses: 1,
                attendancePercentage: 100
            });
        }

        // If attendance record exists, update it
        const { total_attendance, total_classes } = attendanceQuery.rows[0];
        
        // Increment attendance and total classes (assuming present attendance)
        const newTotalClasses = total_classes + 1;
        const newTotalAttendance = total_attendance + 1; // Assuming present attendance

        // Calculate the new attendance percentage
        const attendancePercentage = Math.floor((newTotalAttendance / newTotalClasses) * 100);

        // Update the attendance record in the database
        await client.query(
            'UPDATE Attendance SET total_attendance = $1, total_classes = $2, att_percentage = $3 WHERE student_id = $4 AND faculty_id = $5',
            [newTotalAttendance, newTotalClasses, attendancePercentage, studentId, facultyId]
        );

        res.json({
            message: 'Attendance marked as present successfully',
            totalAttendance: newTotalAttendance,
            totalClasses: newTotalClasses,
            attendancePercentage
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};


export const totalAttendance = async (req, res) => {
    const client = await connectDB();
    try {
        const { facultyId } = req.body;

        // Check if faculty exists
        const facultyQuery = await client.query(
            'SELECT id FROM Faculty WHERE id = $1',
            [facultyId]
        );

        if (facultyQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        // Fetch total attendance for all students under the given faculty
        const attendanceQuery = await client.query(
            `SELECT A.student_id, S.name, A.total_attendance, A.att_percentage, A.total_classes
             FROM Attendance A
             JOIN Student S ON A.student_id = S.student_id
             JOIN Faculty F ON A.faculty_id = F.id
             WHERE A.faculty_id = $1`,
            [facultyId]
        );

        const attendanceData = attendanceQuery.rows;

        if (attendanceData.length === 0) {
            return res.status(404).json({ message: 'No attendance records found for this faculty' });
        }

        res.json({
            facultyId: facultyId,
            totalClasses: attendanceData[0]?.total_classes,
            attendanceRecords: attendanceData.map(record => ({
                studentId: record.student_id,
                studentName: record.name,
                totalAttendance: record.total_attendance,
                attendancePercentage: record.att_percentage
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

