const mysql = require('mysql2/promise');

const connectDB = async () => {
    const connectDB = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Mohit@9893',
        database: 'dbsystem',
    });

    console.log('MySQL connected successfully');

    // Create Course table first since Faculty and Student reference it
    const createCourse = `
        CREATE TABLE IF NOT EXISTS Course (
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_name VARCHAR(255) NOT NULL,
            course_code VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Create Admin table
    const createAdmin = `
        CREATE TABLE IF NOT EXISTS Admin (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Create Faculty table
    const createFaculty = `
        CREATE TABLE IF NOT EXISTS Faculty (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            course_id INT,
            isAdmin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE SET NULL
        )
    `;

    // Create Student table
    const createStudent = `
        CREATE TABLE IF NOT EXISTS Student (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            course_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE SET NULL
        )
    `;

    // Create Attendance table
    const createAttendance = `
        CREATE TABLE IF NOT EXISTS Attendance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT,
            attendance_date DATE NOT NULL,
            status ENUM('present', 'absent') NOT NULL,
            FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE
        )
    `;

    // Create Notice table
    const createNotice = `
        CREATE TABLE IF NOT EXISTS Notice (
            id INT AUTO_INCREMENT PRIMARY KEY,
            noticeNumber INT NOT NULL,
            noticeDescription TEXT NOT NULL,
            noticeDate DATE NOT NULL
        )
    `;

    // Execute the create table queries in the correct order
    try {
        await connectDB.query(createCourse);
        console.log('Course table created or verified successfully.');
        
        await connectDB.query(createAdmin);
        console.log('Admin table created or verified successfully.');
        
        await connectDB.query(createFaculty);
        console.log('Faculty table created or verified successfully.');
        
        await connectDB.query(createStudent);
        console.log('Student table created or verified successfully.');

        await connectDB.query(createAttendance);
        console.log('Attendance table created or verified successfully.');

        await connectDB.query(createNotice);
        console.log('Notice table created or verified successfully.');
    } catch (err) {
        console.error('Error creating tables:', err.message);
    }

    return connectDB; // Return the connection for further queries
};

module.exports = connectDB;
