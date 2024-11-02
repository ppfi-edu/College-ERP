 const connection = require('../utils/db'); // Ensure you have your MySQL connection

exports.getAdminById = async (req, res) => {
  try {
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


exports.createFaculty = (req, res) => {
  const { name, password, email, course_id, isAdmin } = req.body; // Extract properties from req.body
  const sql = 'INSERT INTO Faculty (name, password, email, course_id, isAdmin) VALUES (?, ?, ?, ?, ?)';
  
  connection.query(sql, [name, password, email, course_id, isAdmin], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(400).json({ error: 'Failed to create faculty. ' + err.message });
    }
    res.status(201).json({
      message: "Faculty Created Successfully",
    });
  });
};


exports.createStudent = async (req, res) => {
  try {
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
