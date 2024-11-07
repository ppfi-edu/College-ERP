import { connectDB } from "../utils/db.js"; // Import your  utility
import jwt from "jsonwebtoken"; // Import jwt
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing (if you plan to use it)

const secret = process.env.JWT_SECRET || "secret"; // Use an environment variable for the secret

export const adminFacultyLogin = async (req, res) => {
  const { email, password } = req.body;
  const client = await connectDB(); // Get a client from dbconnect

  try {
    // Check if the user exists in the Admin table
    let { rows } = await client.query('SELECT * FROM Admin WHERE email = $1', [email]);
    let user = rows[0];
    let isAdmin = false;
    console.log(user);

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

    // Validate password if you are using bcrypt for hashing
    // Uncomment this section if password hashing is implemented
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) {
    //   return res.status(401).json({ message: "Invalid email or password" });
    // }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, isAdmin: isAdmin }, secret); // Set an expiration for the token

    res.json({ token, isAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release(); // Release the client back to the pool
  }
};
