import { connectDB } from '../utils/db.js'; // Import your connectDB utility
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

const secret = process.env.JWT_SECRET || "default_secret"; // Use an environment variable for the secret

export const studentLogin = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt for email:', email); // Debug: Log the email being used to log in

    const client = await connectDB(); // Get a client from connectDB
    try {
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
        // Uncomment and use this section if password hashing is implemented
        // const isValidPassword = await bcrypt.compare(password, student.password); // Use bcrypt to compare hashed passwords
        // console.log('Password validation result:', isValidPassword); // Debug: Log password validation result

        // if (!isValidPassword) {
        //     console.log('Invalid password for student:', student.email); // Debug: Log invalid password attempt
        //     return res.status(401).json({ message: 'Invalid email or password' });
        // }

        // Generate JWT token
        const token = jwt.sign({ id: student.id }, secret); // Set an expiration time for the token
        console.log('JWT token generated:', token); // Debug: Log the generated token

        res.json({ token, authenticated: true });
    } catch (error) {
        console.error('Error during student login:', error.message); // Debug: Log error message
        res.status(500).json({ error: 'Internal Server Error' }); // Avoid exposing error details
    } finally {
        client.release(); // Release the client back to the pool
    }
};


