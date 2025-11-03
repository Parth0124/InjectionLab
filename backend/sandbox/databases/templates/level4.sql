CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    mfa_secret TEXT,
    backup_codes TEXT,
    last_login DATETIME
);

CREATE TABLE IF NOT EXISTS sensitive_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_type TEXT,
    data_value TEXT,
    owner_id INTEGER,
    classification TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT
);

INSERT INTO admin (username, password, email, mfa_secret, backup_codes) VALUES
('root_admin', 'R00t@dm1n!SecureP@ss', 'root@injectionlab.com', 'JBSWY3DPEHPK3PXP', '12345,67890,11111,22222,33333'),
('security_admin', 'SecAdm1n$2024!Strong', 'security@injectionlab.com', 'HXDMVJECJJWSRB3H', '44444,55555,66666,77777,88888'),
('backup_admin', 'B@ckup!Secure#2024', 'backup@injectionlab.com', 'MVKC2YLDMU4WG3DI', '99999,00000,11122,33344,55566');

INSERT INTO sensitive_data (data_type, data_value, owner_id, classification) VALUES
('api_key', 'sk-prod-a1b2c3d4e5f6g7h8i9j0', 1, 'confidential'),
('encryption_key', 'AES256-xyz789abc123def456ghi789', 1, 'top-secret'),
('database_credential', 'postgres://admin:SuperSecret123@db.internal:5432/maindb', 2, 'confidential'),
('oauth_secret', 'oauth_secret_a1b2c3d4e5f6g7h8', 2, 'secret'),
('jwt_secret', 'jwt-super-secret-key-do-not-share-2024', 1, 'top-secret');

INSERT INTO audit_log (user_id, action, ip_address) VALUES
(1, 'LOGIN_SUCCESS', '192.168.1.100'),
(1, 'PASSWORD_CHANGE', '192.168.1.100'),
(2, 'LOGIN_SUCCESS', '192.168.1.101'),
(1, 'API_KEY_GENERATED', '192.168.1.100'),
(2, 'BACKUP_CREATED', '192.168.1.101');