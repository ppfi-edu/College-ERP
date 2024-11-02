const mysql = require('mysql2/promise');

const connectDB = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'tanisha1709',
        database: 'dbms'
    });

    console.log('MySQL connected successfully');

    // Create Admin table
    const createAdminTable = `
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
    const createStudentTable = `
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

    // Create Course table
    const createCourseTable = `
        CREATE TABLE IF NOT EXISTS Course (
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_name VARCHAR(255) NOT NULL,
            course_code VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    // Create Attendance table
    const createAttendanceTable = `
        CREATE TABLE IF NOT EXISTS Attendance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT,
            attendance_date DATE NOT NULL,
            status ENUM('present', 'absent') NOT NULL,
            FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE
        )
    `;

    // Create Notice table
    const createNoticeTable = `
        CREATE TABLE IF NOT EXISTS Notice (
            id INT AUTO_INCREMENT PRIMARY KEY,
            noticeNumber INT NOT NULL,
            noticeDescription TEXT NOT NULL,
            noticeDate DATE NOT NULL
        )
    `;

    // Execute the create table queries
    try {
        await connection.query(createAdminTable);
        console.log('Admin table created or verified successfully.');
        
        await connection.query(createFaculty);
        console.log('Faculty table created or verified successfully.');
        
        await connection.query(createStudentTable);
        console.log('Student table created or verified successfully.');
        
        await connection.query(createCourseTable);
        console.log('Course table created or verified successfully.');

        await connection.query(createAttendanceTable);
        console.log('Attendance table created or verified successfully.');

        await connection.query(createNoticeTable);
        console.log('Notice table created or verified successfully.');
    } catch (err) {
        console.error('Error creating tables:', err.message);
    }

    return connection; // Return the connection for further queries
};

module.exports = connectDB;
