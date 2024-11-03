const connectDB = require("../utils/db");
const jwt = require("jsonwebtoken");

const secret = "secret";

exports.adminFacultyLogin = async (req, res) => {
  const { email, password } = req.body;
  let client;

  try {
    // Establish database connection
    client = await connectDB();

    let { rows } = await client.query('SELECT * FROM Admin WHERE email = $1', [email]);
    let user = rows[0];

    let isAdmin = false;

    // If not found in Admin, try to find in the Faculty table
    if (!user) {
      ({ rows } = await client.query('SELECT * FROM Faculty WHERE email = $1', [email]));
      user = rows[0]; // Get the first row if it exists
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      isAdmin = true; // Set as Admin if found in Admin table
    }

    // Validate password
    const isValidPassword = user.password === password;
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, isAdmin : isAdmin }, secret);

    res.json({ token, isAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (client) client.release(); // Ensure connection is released back to the pool
  }
};
