import { connectDB } from '../utils/db.js'; // Import your PostgreSQL connection

export const getAdminById = async (req, res) => {
  let client;
  try {
    client = await connectDB(); // Get a client from the pool
    const { rows } = await client.query('SELECT * FROM Admin WHERE id = $1', [req.params.id]);
    const admin = rows[0]; // Get the first row if it exists
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (client) {
      client.release(); // Release the client back to the pool
    }
  }
};

export const createFaculty = async (req, res) => {
  let client;
  try {
    client = await connectDB(); // Get a client from the pool
    const { name, password, email, course_id } = req.body;

    // Check if course_id exists in the Course table
    if (course_id) {
      const { rows: courseRows } = await client.query('SELECT id FROM Course WHERE id = $1', [course_id]);
      if (courseRows.length === 0) {
        return res.status(400).json({ error: 'Invalid course_id: Course not found' });
      }
    }

    // Insert the faculty member
    const sql = 'INSERT INTO Faculty (name, password, email, course_id) VALUES ($1, $2, $3, $4) RETURNING id';
    const { rows: result } = await client.query(sql, [name, password, email, course_id || null]);

    res.status(201).json({
      message: "Faculty Created Successfully",
      facultyId: result[0].id, // Optional: return the new faculty ID
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(400).json({ error: 'Failed to create faculty. ' + err.message });
  } finally {
    if (client) {
      client.release(); // Release the client back to the pool
    }
  }
};

export const createStudent = async (req, res) => {
  let client;
  try {
    client = await connectDB(); // Get a client from the pool
    const { name, password, email, course_id } = req.body;

    // Insert the student
    const sql = 'INSERT INTO Student (name, password, email, course_id) VALUES ($1, $2, $3, $4) RETURNING id';
    const { rows: result } = await client.query(sql, [name, password, email, course_id]);

    res.status(201).json({
      message: "Student Created Successfully",
      studentId: result[0].id, // Optional: return the new student ID
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(400).json({ error: 'Failed to create student. ' + error.message });
  } finally {
    if (client) {
      client.release(); // Release the client back to the pool
    }
  }
};
