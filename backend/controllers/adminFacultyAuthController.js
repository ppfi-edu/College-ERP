// const Admin = require("../models/Admin");
// const Faculty = require("../models/Faculty");
// const jwt = require("jsonwebtoken");

// const secret = "secret";

// exports.adminFacultyLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await Admin.findOne({ email });

//     if (!user) {
//       user = await Faculty.findOne({ email });
//       if (!user) {
//         return res.status(401).json({ message: "Invalid email or password" });
//       }
//     }
//     let isAdmin = user.isAdmin;
//     // Validate password
//     const isValidPassword = user.password === password;
//     if (!isValidPassword) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign({ id: user._id, isAdmin: isAdmin }, secret);

//     res.json({ token, isAdmin });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const connection = require("../utils/db");
const jwt = require("jsonwebtoken");

const secret = "secret";

exports.adminFacultyLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, try to find the user in the admin table
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
