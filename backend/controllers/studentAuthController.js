const connectDB = require('../utils/db');
const jwt = require('jsonwebtoken');

const secret = "secret";

exports.studentLogin = async (req, res) => {
    let connection;
    const { email, password } = req.body;
    try {
        connection = await connectDB(); // Establish the connection
        // Fetch the student from the database using the provided email
        const [students] = await connection.promise().query('SELECT * FROM student WHERE email = ?', [email]);
        
        // Check if the student exists
        if (students.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const student = students[0];

        // Validate password
        const isValidPassword = student.password === password; // Note: You should hash passwords in a production application
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: student.id }, secret);

        res.json({ token, authenticated: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
