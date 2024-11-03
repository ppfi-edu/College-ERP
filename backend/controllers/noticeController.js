const connectDB = require("../utils/db");

exports.getAllNotice = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { rows: notices } = await client.query('SELECT * FROM notice');
        if (notices.length === 0) {
            return res.status(404).json({ message: 'No notices found' });
        }
        res.json(notices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.addNotice = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { title, content, date, ...otherDetails } = req.body; // Adjust based on your notice fields

        // Construct the SQL query dynamically to include additional fields
        const columns = ['title', 'content', 'date', ...Object.keys(otherDetails)];
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
        const values = [title, content, date, ...Object.values(otherDetails)];

        const { rows } = await client.query(`INSERT INTO notice (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`, values);
        
        res.status(201).json({
            message: "Notice added successfully",
            id: rows[0].id // Return the ID of the new notice
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.deleteNotice = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { rowCount } = await client.query('DELETE FROM notice WHERE id = $1', [req.params.id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Notice not found" });
        }
        
        res.json({
            message: "Notice deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};
