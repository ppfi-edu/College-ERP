import connectDB from "../utils/db.js"; // Import the pool directly

export const getAllCourses = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Get a client from the pool
        const { rows: courses } = await client.query('SELECT * FROM Course'); // Use client.query() directly
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
};

export const getCourseById = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Get a client from the pool
        const { rows: course } = await client.query('SELECT * FROM Course WHERE id = $1', [req.params.id]);
        
        if (course.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course[0]); // Return the first course object
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
};

export const createCourse = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Get a client from the pool
        const { course_name, course_code } = req.body; // Assuming both fields are passed in the request body
        console.log("DEBUG: Received course data:", { course_name, course_code });
        // Insert both course_name and course_code into the table
        const { rows } = await client.query(
            'INSERT INTO Course (course_name, course_code) VALUES ($1, $2) RETURNING id', 
            [course_name, course_code]
        );

        res.status(201).json({
            message: "Course created successfully",
            courseId: rows[0].id, // Return the ID of the created course
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
};

export const updateCourse = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Get a client from the pool
        const { name } = req.body; // Assuming name is the only field being updated
        const { rowCount } = await client.query('UPDATE Course SET name = $1 WHERE id = $2', [name, req.params.id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({
            message: "Course details updated!"
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
};

export const deleteCourse = async (req, res) => {
    let client;
    try {
        client = await connectDB(); // Get a client from the pool
        console.log("DEBUG: Deleting course with ID:", req.params.name);
        const { rowCount } = await client.query('DELETE FROM Course WHERE course_name = $1', [req.params.name]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
};
