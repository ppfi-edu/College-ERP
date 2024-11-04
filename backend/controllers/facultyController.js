import connectDB  from "../utils/db.js"; // Import your connectDB utility

export const getAllFaculty = async (req, res) => {
    const client = await connectDB(); // Get a client from connectDB
    try {
        const { rows: faculty } = await client.query('SELECT * FROM faculty');
        res.json(faculty);
    } catch (error) {
        console.error('Error fetching faculty:', error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release(); // Release the client back to the pool
    }
};

export const getFacultyById = async (req, res) => {
    const client = await connectDB(); // Get a client from connectDB
    try {
        const { rows: faculty } = await client.query('SELECT * FROM faculty WHERE id = $1', [req.params.id]);
        if (faculty.length === 0) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }
        res.json(faculty[0]);
    } catch (error) {
        console.error('Error fetching faculty by ID:', error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release(); // Release the client back to the pool
    }
};

export const createFaculty = async (req, res) => {
    const client = await connectDB(); // Get a client from connectDB
    try {
        const { name, email, password, ...otherDetails } = req.body;

        // Ensure required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Construct the SQL query dynamically to include additional fields
        const columns = ['name', 'email', 'password', ...Object.keys(otherDetails)];
        const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
        const values = [name, email, password, ...Object.values(otherDetails)];

        const { rows } = await client.query(`INSERT INTO faculty (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`, values);

        const newFaculty = { id: rows[0].id, name, email, ...otherDetails };
        res.status(201).json(newFaculty);
    } catch (error) {
        console.error('Error creating faculty:', error); // Log the error for debugging
        res.status(400).json({ error: error.message });
    } finally {
        client.release(); // Release the client back to the pool
    }
};

export const updateFaculty = async (req, res) => {
    const client = await connectDB(); // Get a client from connectDB
    try {
        const { name, email, password, ...otherDetails } = req.body;

        // Construct the SQL query dynamically to include additional fields
        const updates = ['name = $1', 'email = $2', 'password = $3', ...Object.keys(otherDetails).map((key, index) => `${key} = $${index + 4}`)];
        const values = [name, email, password, ...Object.values(otherDetails), req.params.id];

        const { rowCount } = await client.query(`UPDATE faculty SET ${updates.join(', ')} WHERE id = $${updates.length + 1}`, values);

        if (rowCount === 0) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }

        res.json({ message: "Faculty member updated successfully" });
    } catch (error) {
        console.error('Error updating faculty:', error); // Log the error for debugging
        res.status(400).json({ error: error.message });
    } finally {
        client.release(); // Release the client back to the pool
    }
};

export const deleteFaculty = async (req, res) => {
    const client = await connectDB(); // Get a client from connectDB
    try {
        const { rowCount } = await client.query('DELETE FROM faculty WHERE email = $1', [req.params.email]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        res.json({ message: 'Faculty member deleted successfully' });
    } catch (error) {
        console.error('Error deleting faculty:', error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release(); // Release the client back to the pool
    }
};
