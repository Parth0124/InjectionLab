CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email, role) VALUES
('admin', 'secretAdminPass123', 'admin@injectionlab.com', 'admin'),
('john_doe', 'password123', 'john@example.com', 'user'),
('jane_smith', 'pass456word', 'jane@example.com', 'user'),
('bob_wilson', 'mySecretPass', 'bob@example.com', 'user');