-- Level 1: Basic Authentication Bypass
-- Simple login form vulnerable to basic SQL injection

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'user'
);

INSERT INTO users (username, password, email, role) VALUES
('admin', 'admin123', 'admin@example.com', 'admin'),
('john_doe', 'password123', 'john@example.com', 'user'),
('jane_smith', 'qwerty456', 'jane@example.com', 'user'),
('test_user', 'test123', 'test@example.com', 'user');

-- The vulnerable query would be:
-- SELECT * FROM users WHERE username = '$username' AND password = '$password'
