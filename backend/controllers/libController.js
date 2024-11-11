import connectDB from "../utils/db.js";

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

export const addLib = async (req, res) => {
    const client = await connectDB();
    try {
        const { book_id, book_name, topic, author_name } = req.body;
        await client.query(
            `INSERT INTO Library (book_id, book_name, topic, author_name) VALUES ($1, $2, $3, $4)`,
            [book_id,book_name, topic, author_name]
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
        // Check if the book is already issued
        const { rows: bookRows } = await client.query(
            'SELECT issued, issued_to FROM Library WHERE id = $1',
            [req.params.id]
        );

        if (bookRows.length === 0) {
            return res.status(404).json({ message: "Library not found" });
        }

        const { issued, issued_to: currentIssuedTo } = bookRows[0];

        if (issued) {
            return res.status(400).json({ message: `Book is already issued to ${currentIssuedTo}` });
        }

        // Issue the book if it is not already issued
        const { issued_to, issued_date, issued_return_date } = req.body;
        const { rowCount } = await client.query(
            'UPDATE Library SET issued = TRUE, issued_to = $1, issued_date = $2, issued_return_date = $3 WHERE id = $4',
            [issued_to, issued_date, issued_return_date, req.params.id]
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
};

export const ReturnBook = async (req, res) => {
    const client = await connectDB();
    try {
        console.log("req.params.id", req.params.id);
        // Fetch the return date and issued_to details of the book
        const { rows: libraryRows } = await client.query(
            'SELECT issued_return_date, issued_to FROM Library WHERE id = $1',
            [req.params.id]
        );

        if (libraryRows.length === 0) {
            return res.status(404).json({ message: "Library not found" });
        }

        const { issued_return_date, issued_to } = libraryRows[0];

        // Fetch the student's email from the Student table using student_id
        const { rows: studentRows } = await client.query(
            'SELECT email FROM Student WHERE student_id = $1',
            [issued_to]
        );

        if (studentRows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const { email: studentEmail } = studentRows[0];

        // Calculate late submission fee
        const currentDate = new Date();
        const returnDate = new Date(issued_return_date);
        let lateFee = 0;

        if (currentDate > returnDate) {
            const diffTime = Math.abs(currentDate - returnDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            lateFee = diffDays * 10; // Assuming a late fee of $10 per day
        }

        // Update the Library table to mark the book as returned
        const { rowCount } = await client.query(
            'UPDATE Library SET issued = FALSE, issued_to = NULL, issued_date = NULL, issued_return_date = NULL WHERE id = $1',
            [req.params.id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Library not found" });
        }

        // If there is a late fee, add it to the Fee table
        if (lateFee > 0) {
            await client.query(
                'INSERT INTO Fee (student_id, email, reason, amount, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)',
                [issued_to, studentEmail, 'Late Book Return', lateFee]
            );
        }

        res.json({ message: "Book Returned!", lateFee });
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
};


export const removeBook = async (req, res) => {

    console.log("removing book")
    const client = await connectDB();
    console.log("req.params", req.params)
    try {
        // Check if the book is currently issued
        const { rows: bookRows } = await client.query(
            'SELECT issued FROM Library WHERE id = $1',
            [req.params.id]
        );

        console.log("bookRows", bookRows)

        if (bookRows.length === 0) {
            return res.status(404).json({ message: "Library not found" });
        }

        const { issued } = bookRows[0];

        if (issued) {
            console.log("Book is currently issued to someone")
            return res.status(400).json({ message: "Book is currently issued to someone" });

        }

        // Delete the book if it is not issued
        const { rowCount } = await client.query('DELETE FROM Library WHERE id = $1', [req.params.id]);
        if (rowCount === 0) {
            return res.status(404).json({ message: "Library not found" });
        }
        res.json({ message: "Library deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

