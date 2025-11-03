CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    ssn TEXT,
    credit_card TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email, ssn, credit_card, role) VALUES
('admin', 'adminSecure2024', 'admin@injectionlab.com', '123-45-6789', '4532-1234-5678-9010', 'admin'),
('alice', 'alicePass!23', 'alice@example.com', '234-56-7890', '4716-2345-6789-0123', 'user'),
('charlie', 'charlie@secure', 'charlie@example.com', '345-67-8901', '5412-3456-7890-1234', 'user'),
('david', 'davidPwd456', 'david@example.com', '456-78-9012', '5512-4567-8901-2345', 'user'),
('emma', 'emmaPa$$w0rd', 'emma@example.com', '567-89-0123', '4916-5678-9012-3456', 'user');
