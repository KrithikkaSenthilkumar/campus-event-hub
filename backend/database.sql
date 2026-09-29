CREATE DATABASE IF NOT EXISTS campus_event_hub;
USE campus_event_hub;

DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('student','admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(60) NOT NULL,
    event_date DATE NOT NULL,
    venue VARCHAR(150) NOT NULL,
    capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_registration (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

INSERT INTO users (name,email,password,role) VALUES
('Admin','admin@campus.com','admin123','admin'),
('Demo Student','student@campus.com','student123','student');

INSERT INTO events (title,description,category,event_date,venue,capacity) VALUES
('Tech Talk 2026','A practical session on modern software development and career skills.','Technology','2026-10-10','Seminar Hall',100),
('Code Sprint','A beginner-friendly coding challenge for students.','Coding','2026-10-18','Computer Lab 2',60),
('Design Thinking Workshop','Learn problem solving and user-centered design methods.','Workshop','2026-10-24','Innovation Lab',50),
('Campus Photography Walk','Explore campus photography with a guided creative walk.','Arts','2026-11-02','Main Gate',40);
