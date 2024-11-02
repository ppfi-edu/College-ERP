// const Student = require('../models/Student');
// const jwt = require('jsonwebtoken');

// const secret = "secret";
// exports.studentLogin = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const student = await Student.findOne({ email });
//     if (!student) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Validate password
//     const isValidPassword = student.password === password;
//     if (!isValidPassword) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign({ id: student._id }, secret);

//     res.json({ token, authenticated: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const connection = require('../utils/db');
const jwt = require('jsonwebtoken');

const secret = "secret";

exports.studentLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
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
