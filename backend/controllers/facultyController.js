const connectDB = require("../utils/db");

exports.getAllFaculty = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { rows: faculty } = await client.query('SELECT * FROM faculty');
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.getFacultyById = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { rows: faculty } = await client.query('SELECT * FROM faculty WHERE id = $1', [req.params.id]);
        if (faculty.length === 0) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }
        res.json(faculty[0]); // Return the first faculty object
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.createFaculty = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { name, email, password, ...otherDetails } = req.body; // Destructure to get the necessary fields

        // Construct the SQL query dynamically to include additional fields
        const columns = ['name', 'email', 'password', ...Object.keys(otherDetails)];
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
        const values = [name, email, password, ...Object.values(otherDetails)];

        const { rows } = await client.query(`INSERT INTO faculty (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`, values);

        const newFaculty = { id: rows[0].id, name, email, password, ...otherDetails }; // Include the newly created ID
        res.status(201).json(newFaculty);
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.updateFaculty = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { name, email, password, ...otherDetails } = req.body; // Destructure to get the necessary fields

        // Construct the SQL query dynamically to include additional fields
        const updates = ['name = $1', 'email = $2', 'password = $3', ...Object.keys(otherDetails).map((key, index) => `${key} = $${index + 4}`)];
        const values = [name, email, password, ...Object.values(otherDetails), req.params.id];

        const { rowCount } = await client.query(`UPDATE faculty SET ${updates.join(', ')} WHERE id = $${updates.length + 1}`, values);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }

        res.json({ message: "Faculty member updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};

exports.deleteFaculty = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Establish the connection
        const { rowCount } = await client.query('DELETE FROM faculty WHERE email = $1', [req.params.email]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        res.json({ message: 'Faculty member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release(); // Release the client back to the pool
    }
};
