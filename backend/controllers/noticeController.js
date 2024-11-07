import connectDB from "../utils/db.js"; // Import the pool directly

export const getAllNotice = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Get a client from the pool
        console.log("Fetching all notices");
        const { rows: notices } = await client.query('SELECT * FROM Notice');
        if (notices.length === 0) {
            return res.status(404).json({ message: 'No notices found' });
        }
        res.json(notices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
};

export const addNotice = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Get a client from the pool

        // Extract fields based on the table columns
        const {noticeDescription, noticeTitle} = req.body;

        // Validate required fields
        if (!noticeDescription || !noticeTitle) {
            return res.status(400).json({ error: "Missing required fields: noticeNumber, noticeDescription, or noticeDate" });
        }

        // Insert query with matching column names from the Notice table
        const { rows } = await client.query(
            `INSERT INTO Notice (noticedescription, noticetitle) VALUES ($1, $2) RETURNING id`,
            [noticeDescription, noticeTitle]
        );
        
        res.status(201).json({
            message: "Notice added successfully",
            id: rows[0].id // Return the ID of the new notice
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
};


export const deleteNotice = async (req, res) => {
    let client = await connectDB();
    try {
        const { rowCount } = await client.query('DELETE FROM Notice WHERE id = $1', [req.params.id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Notice not found" });
        }
        
        res.json({
            message: "Notice deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
};
