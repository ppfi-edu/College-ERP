CREATE TABLE IF NOT EXISTS Course (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Faculty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    course_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES Course(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Student (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE, -- New field for the formatted ID
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    course_id VARCHAR(255)[], -- Changed to VARCHAR array
    enrollment_year INT NOT NULL, -- New field for enrollment year
    branch VARCHAR(10) NOT NULL, -- New field for branch (e.g., CSE, ECE)
    roll_number INT NOT NULL, -- Field to store the unique roll number within the branch and year
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE attendance_status AS ENUM ('present', 'absent');

CREATE TABLE IF NOT EXISTS Attendance (
    id SERIAL PRIMARY KEY,
    faculty_id INT,
    student_id INT,
    attendance_date DATE NOT NULL,
    status attendance_status NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Notice (
    id SERIAL PRIMARY KEY,
    noticeNumber INT ,
    noticeDescription TEXT ,
    noticeDate DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS Events (
    id SERIAL PRIMARY KEY,
    eventNumber INT ,
    eventDescription TEXT ,
    eventDate DATE NOT NULL,
    eventImage BYTEA, 
    eventVideo BYTEA  
);

CREATE TABLE IF NOT EXISTS Fee (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) REFERENCES Student(student_id) ON DELETE CASCADE,
    reason VARCHAR(255) NOT NULL, -- Reason for the fee (e.g., tuition, library, etc.)
    amount DECIMAL(10, 2) NOT NULL, -- Amount of the fee
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Library (
    id SERIAL PRIMARY KEY,
    book_name VARCHAR(255) NOT NULL,
    book_id VARCHAR(255) NOT NULL UNIQUE,
    topic VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issued BOOLEAN DEFAULT FALSE,
    issued_to VARCHAR(255),
    issued_date DATE,
    issued_return_date DATE,
);

