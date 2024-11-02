const connectDB = require("../utils/db");
const jwt = require("jsonwebtoken");

const secret = "secret";

exports.adminFacultyLogin = async (req, res) => {
  const { email, password } = req.body;
  let connection;
  try {
    // First, try to find the user in the admin table
    connection = await connectDB(); 
    let [rows] = await connection.promise().query('SELECT * FROM admin WHERE email = ?', [email]);
    let user = rows[0]; // Get the first row if it exists

    // If not found in admin, try to find in the faculty table
    if (!user) {
      [rows] = await connection.promise().query('SELECT * FROM faculty WHERE email = ?', [email]);
      user = rows[0]; // Get the first row if it exists
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    }

    const isAdmin = user.isAdmin; // Assuming isAdmin is a column in both tables

    // Validate password
    const isValidPassword = user.password === password;
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, isAdmin: isAdmin }, secret); // Change user._id to user.id for MySQL

    res.json({ token, isAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
