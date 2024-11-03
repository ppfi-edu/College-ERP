const { Pool } = require('pg');
require('dotenv').config();

console.log(process.env.POSTGRES_URL);

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const createCourse = `
CREATE TABLE IF NOT EXISTS Course (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

const createAdmin = `
CREATE TABLE IF NOT EXISTS Admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

const createFaculty = `
CREATE TABLE IF NOT EXISTS Faculty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    course_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE SET NULL
)
`;

const createStudent = `
CREATE TABLE IF NOT EXISTS Student (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    course_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE SET NULL
)
`;

const createAttendanceStatusType = `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        CREATE TYPE attendance_status AS ENUM ('present', 'absent');
    END IF;
END $$;
`;

const createAttendance = `
CREATE TABLE IF NOT EXISTS Attendance (
    id SERIAL PRIMARY KEY,
    student_id INT,
    attendance_date DATE NOT NULL,
    status attendance_status NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE
)
`;

const createNotice = `
CREATE TABLE IF NOT EXISTS Notice (
    id SERIAL PRIMARY KEY,
    noticeNumber INT NOT NULL,
    noticeDescription TEXT NOT NULL,
    noticeDate DATE NOT NULL
)
`;
const createEvents=`
CREATE TABLE IF NOT EXISTS Events (
    id SERIAL PRIMARY KEY,
    eventNumber INT ,
    eventDescription TEXT ,
    eventDate DATE NOT NULL,
    eventImage BYTEA, 
    eventVideo BYTEA  
)
`;


const connectDB = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('PostgreSQL connected successfully');
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
    }
    return client;
};

const disconnectDB = async () => {
    try {
        await pool.end();
        console.log('PostgreSQL disconnected successfully');
    } catch (err) {
        console.error('Error disconnecting from the database:', err.message);
    }
};

const createTables = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('Creating tables...');

        await client.query(createCourse);
        console.log('Course table created or verified successfully.');

        await client.query(createAdmin);
         console.log('Admin table created or verified successfully.');

        await client.query(createFaculty);
        console.log('Faculty table created or verified successfully.');

        await client.query(createStudent);
        console.log('Student table created or verified successfully.');

        await client.query(createAttendanceStatusType); // Create ENUM type first
        console.log('AttendanceStatusType created or verified successfully.');

        await client.query(createAttendance);
        console.log('Attendance table created or verified successfully.');

        await client.query(createNotice);
        console.log('Notice table created or verified successfully.');

        await client.query(createEvents);
        console.log('Events table created or verified successfully.');
    } catch (err) {
        console.error('Error creating tables:', err.message);
    } finally {
        if (client) {
            client.release();
        }
    }
};

// Call createTables when the backend starts
// createTables();

module.exports = connectDB;