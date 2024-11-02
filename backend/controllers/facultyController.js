const connectDB = require("../utils/db");

exports.getAllFaculty = async (req, res) => {
    let connection;
    try {
        connection = await connectDB();
        const [faculty] = await connection.query('SELECT * FROM faculty');
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFacultyById = async (req, res) => {
    let connection;
    try {
        connection = await connectDB();
        const [faculty] = await connection.promise().query('SELECT * FROM faculty WHERE id = ?', [req.params.id]);
        if (faculty.length === 0) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }
        res.json(faculty[0]); // Return the first faculty object
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createFaculty = async (req, res) => {
    let connection;
    try {
        connection = await connectDB();
        const { name, email, password, ...otherDetails } = req.body; // Destructure to get the necessary fields
        const [result] = await connection.promise().query('INSERT INTO faculty (name, email, password, ...) VALUES (?, ?, ?, ...)', [name, email, password, ...otherDetails]);

        const newFaculty = { id: result.insertId, name, email, password, ...otherDetails }; // Include the newly created ID
        res.status(201).json(newFaculty);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateFaculty = async (req, res) => {
    let connection;
    try {
        connection = await connectDB();
        const { name, email, password, ...otherDetails } = req.body; // Destructure to get the necessary fields
        const [result] = await connection.promise().query('UPDATE faculty SET name = ?, email = ?, password = ?, ... WHERE id = ?', [name, email, password, ...otherDetails, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }

        res.json({ message: "Faculty member updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteFaculty = async (req, res) => {
    let connection;
    try {
        connection = await connectDB();
        const [result] = await connection.promise().query('DELETE FROM faculty WHERE email = ?', [req.params.email]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        res.json({ message: 'Faculty member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
