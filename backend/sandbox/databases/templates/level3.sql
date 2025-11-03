CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    category TEXT
);

CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    api_key TEXT,
    secret_token TEXT
);

CREATE TABLE IF NOT EXISTS customer_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    total_price REAL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, category) VALUES
('Laptop Pro', 'High-performance laptop', 1299.99, 'Electronics'),
('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 'Accessories'),
('USB-C Cable', 'Fast charging cable', 19.99, 'Accessories'),
('Monitor 4K', 'Ultra HD monitor', 599.99, 'Electronics'),
('Keyboard Mechanical', 'RGB mechanical keyboard', 149.99, 'Accessories');

INSERT INTO admin_users (username, password, email, api_key, secret_token) VALUES
('superadmin', 'SuperSecret!2024', 'superadmin@injectionlab.com', 'sk-live-abc123def456', 'tok_prod_xyz789ghi012'),
('db_admin', 'DatabaseMaster99', 'dbadmin@injectionlab.com', 'sk-live-jkl345mno678', 'tok_prod_pqr901stu234'),
('system', 'Sys@dm1n2024', 'system@injectionlab.com', 'sk-live-vwx567yza890', 'tok_prod_bcd123efg456');

INSERT INTO customer_orders (customer_id, product_id, quantity, total_price) VALUES
(1, 1, 1, 1299.99),
(2, 2, 2, 59.98),
(1, 3, 3, 59.97),
(3, 4, 1, 599.99),
(2, 5, 1, 149.99);