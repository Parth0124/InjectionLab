-- Level 2: Information Disclosure
-- Product search with vulnerable WHERE clause

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category TEXT,
    stock INTEGER
);

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT
);

INSERT INTO products VALUES
(1, 'Laptop Pro', 'High-performance laptop', 1299.99, 'electronics', 15),
(2, 'Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 'electronics', 50),
(3, 'Office Chair', 'Comfortable office chair', 199.99, 'furniture', 8),
(4, 'Coffee Mug', 'Ceramic coffee mug', 12.99, 'kitchen', 25);

INSERT INTO customers VALUES
(1, 'Alice Johnson', 'alice@email.com', '555-0101', '123 Main St'),
(2, 'Bob Wilson', 'bob@email.com', '555-0102', '456 Oak Ave'),
(3, 'Carol Brown', 'carol@email.com', '555-0103', '789 Pine Rd');

-- The vulnerable query would be:
-- SELECT * FROM products WHERE category = '$category' AND price < $maxPrice
