 const connectDB = require('../utils/db'); // Ensure you have your MySQL connection

exports.getAdminById = async (req, res) => {
  let connection
  try {
    connection = await connectDB(); 
    const [rows] = await connection.query('SELECT * FROM admin WHERE id = ?', [req.params.id]);
    const admin = rows[0]; // Get the first row if it exists
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createFaculty = async (req, res) => {
  let connection; // Declare connection outside the try block

  try {
    connection = await connectDB(); // Establish the connection

    const { name, password, email, course_id, isAdmin } = req.body;

    // Check if course_id exists in the Course table
    if (course_id) {
      const [courseRows] = await connection.query('SELECT id FROM Course WHERE id = ?', [course_id]);
      if (courseRows.length === 0) {
        return res.status(400).json({ error: 'Invalid course_id: Course not found' });
      }
    }

    // Insert the faculty member
    const sql = 'INSERT INTO Faculty (name, password, email, course_id, isAdmin) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.query(sql, [name, password, email, course_id || null, isAdmin]);

    res.status(201).json({
      message: "Faculty Created Successfully",
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(400).json({ error: 'Failed to create faculty. ' + err.message });
  }
};


exports.createStudent = async (req, res) => {
  let connection
  try {
    connection = await connectDB(); 
    // Create student
    const { name, password, email, course_id } = req.body; // Extract properties from req.body
    await connection.query('INSERT INTO student (name, password, email, course_id) VALUES (?, ?, ?, ?)', [name, password, email, course_id]);
    res.status(201).json({
      message: "Student Created Successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
