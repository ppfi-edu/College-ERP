import connectDB  from '../utils/db.js'; // Import your connectDB utility

export const getAllFee = async (req, res) => {
    const client = await connectDB(); // Get a client from connectDB
    try {
        const { rows: students } = await client.query('SELECT * FROM Fee');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release(); // Release the client back to the pool
    }
};



export const getFeeByIdorEmail = async (req, res) => {
    const client = await connectDB();
    try {
        const { rows: students } = await client.query('SELECT * FROM Fee WHERE student_id = $1 OR student_email = $2', [req.params.student_id, req.params.student_email]);
        if (students.length === 0) {
            return res.status(404).json({ message: "Fee not found" });
        }
        res.json(students[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
}


export const createFee = async (req, res) => {
    const client = await connectDB();
    try {
        const { student_id, student_email, reason, amount } = req.body;

        const { rows } = await client.query(
            `INSERT INTO Fee 
                (student_id, student_email, reason, amount, created_at) 
             VALUES 
                ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
             RETURNING student_id`,
            [student_id, student_email, reason, amount]
        );

        console.log("DEBUG: Insert query result:", rows);

        res.status(201).json({ message: "Fee created successfully", student_id: rows[0].student_id });
    } catch (error) {
        console.error("DEBUG: Error during fee creation:", error);
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
        console.log("DEBUG: Database client released.");
    }
}

export const addFeeforAll = async (req, res) => {
    const client = await connectDB();
    try {
        const { reason, amount } = req.body;

        // Fetch all students
        const { rows: students } = await client.query('SELECT student_id, email FROM Student');

        // Insert fee for each student
        const insertPromises = students.map(student => {
            return client.query(
                `INSERT INTO Fee 
                    (student_id, student_email, reason, amount, created_at) 
                 VALUES 
                    ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
                [student.student_id, student.email, reason, amount]
            );
        });

        await Promise.all(insertPromises);

        res.status(201).json({ message: "Fee added for all students successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
}


export const updateFeebyId = async (req, res) => {
    const client = await connectDB();
    try {
        const { reason, amount, id } = req.body; // Extract fields to be updated
        const { rowCount } = await client.query(
            'UPDATE Fee SET reason = $1, amount = $2 WHERE id = $3',
            [reason, amount, id]
        );
        if (rowCount === 0) {
            return res.status(404).json({ message: "Fee not found" });
        }
        res.json({ message: "Fee details updated!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
}


export const deleteFeeById = async (req, res) => {
    console.log("DEBUG: Deleting fee with ID:", req.params.id);
    const client = await connectDB();
    try {
        const { rowCount } = await client.query('DELETE FROM Fee WHERE id = $1', [req.params.id]);
        if (rowCount === 0) {
            return res.status(404).json({ message: "Fee not found" });
        }
        res.json({ message: "Fee deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
}

export const Getfeetilldate = async (req, res) => {
    const client = await connectDB();
    try {
        const { rows: students } = await client.query('SELECT * FROM Fee WHERE created_at <= $1', [req.params.created_at]);
        if (students.length === 0) {
            return res.status(404).json({ message: "Fee not found" });
        }
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
}

