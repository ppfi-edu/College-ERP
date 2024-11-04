import connectDB from "../utils/db";

export const getAllLib = async (req, res) => {
    const client = await connectDB();
    try {
        const { rows: students } = await client.query('SELECT * FROM Library');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
}


export const getLibByName = async (req, res) => {
    const client = await connectDB();
    try {
        const { rows: students } = await client.query('SELECT * FROM Library WHERE book_name = $1', [req.params.book_name]);
        if (students.length === 0) {
            return res.status(404).json({ message: "Library not found" });
        }
        res.json(students[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
}


export const addLib = async (req, res) => {
    const client = await connectDB();
    try {
        const { book_name, topic, author_name } = req.body;
        await client.query(
            `INSERT INTO Library (book_name, topic, author_name) VALUES ($1, $2, $3)`,
            [book_name, topic, author_name]
        );
        res.status(201).json({ message: "Library added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
}


export const IssueBook = async (req, res) => {
    const client = await connectDB();
    try {
        const { issued_to, issued_date, issued_return_date } = req.body;
        const { rowCount } = await client.query(
            'UPDATE Library SET issued = TRUE, issued_to = $1, issued_date = $2, issued_return_date = $3 WHERE book_name = $4',
            [issued_to, issued_date, issued_return_date, req.params.book_name]
        );
        if (rowCount === 0) {
            return res.status(404).json({ message: "Library not found" });
        }
        res.json({ message: "Book Issued!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
}

export const ReturnBook = async (req, res) => {
    const client = await connectDB();
    try {
        const { rowCount } = await client.query(
            'UPDATE Library SET issued = FALSE, issued_to = NULL, issued_date = NULL, issued_return_date = NULL WHERE book_name = $1',
            [req.params.book_name]
        );
        if (rowCount === 0) {
            return res.status(404).json({ message: "Library not found" });
        }
        res.json({ message: "Book Returned!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
}


const removeBook = async (req, res) => {
    const client = await connectDB();
    try {
        const { rowCount } = await client.query('DELETE FROM Library WHERE book_name = $1', [req.params.book_name]);
        if (rowCount === 0) {
            return res.status(404).json({ message: "Library not found" });
        }
        res.json({ message: "Library deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
}

