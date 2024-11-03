const connectDB = require('../utils/db');
const jwt = require('jsonwebtoken');

const secret = "secret";

exports.studentLogin = async (req, res) => {
    let client;
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email); // Debug: Log the email being used to log in

    try {
        client = await connectDB(); // Establish the connection
        console.log('Database connection established.'); // Debug: Confirm DB connection

        // Fetch the student from the database using the provided email
        const { rows } = await client.query('SELECT * FROM Student WHERE email = $1', [email]);
        console.log('Query executed. Rows returned:', rows.length); // Debug: Log the number of rows returned

        // Check if the student exists
        if (rows.length === 0) {
            console.log('No student found with the given email.'); // Debug: Log if no student found
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const student = rows[0];
        console.log('Student found:', student); // Debug: Log the student information

        // Validate password
        // const isValidPassword = student.password === password; // Note: Passwords should be hashed in production
        // console.log('Password validation result:', isValidPassword); // Debug: Log password validation result

        // if (!isValidPassword) {
        //     console.log('Invalid password for student:', student.email); // Debug: Log invalid password attempt
        //     return res.status(401).json({ message: 'Invalid email or password' });
        // }

        // Generate JWT token
        const token = jwt.sign({ id: student.id }, secret);
        console.log('JWT token generated:', token); // Debug: Log the generated token

        res.json({ token, authenticated: true });
    } catch (error) {
        console.error('Error during student login:', error.message); // Debug: Log error message
        res.status(500).json({ error: error.message });
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
            console.log('Database connection released.'); // Debug: Confirm DB connection release
        }
    }
};
