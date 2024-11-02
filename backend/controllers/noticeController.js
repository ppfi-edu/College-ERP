const connectDB = require("../utils/db");

exports.getAllNotice = async (req, res) => {
    let connection;
    try {
        connection = await connectDB();
        const [notices] = await connection.promise().query('SELECT * FROM notice');
        if (notices.length === 0) {
            return res.status(404).json({ message: 'No notices found' });
        }
        res.json(notices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addNotice = async (req, res) => {
    let connection;
    try {
        connection = await connectDB();
        const { title, content, date, ...otherDetails } = req.body; // Adjust based on your notice fields
        const [result] = await connection.promise().query(
            'INSERT INTO notice (title, content, date, ...) VALUES (?, ?, ?, ...)', 
            [title, content, date, ...otherDetails]
        );
        
        res.status(201).json({
            message: "Notice added Successfully",
            id: result.insertId // Return the ID of the new notice
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteNotice = async (req, res) => {
    let connection;
    try {
        connection = await connectDB();
        const [result] = await connection.promise().query('DELETE FROM notice WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Notice not found" });
        }
        
        res.json({
            message: "Notice deleted successfully"
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
