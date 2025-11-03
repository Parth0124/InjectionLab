CREATE TABLE IF NOT EXISTS vault_secrets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    secret_name TEXT NOT NULL UNIQUE,
    secret_value TEXT NOT NULL,
    owner TEXT,
    access_level INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
);

CREATE TABLE IF NOT EXISTS crypto_wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet_address TEXT NOT NULL UNIQUE,
    private_key TEXT NOT NULL,
    seed_phrase TEXT NOT NULL,
    balance REAL DEFAULT 0,
    owner_id INTEGER
);

CREATE TABLE IF NOT EXISTS security_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token_type TEXT,
    token_value TEXT,
    issued_to INTEGER,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    is_revoked INTEGER DEFAULT 0
);

INSERT INTO vault_secrets (secret_name, secret_value, owner, access_level) VALUES
('master_password', 'M@sterP@ssw0rd!2024#Secure', 'root_admin', 10),
('db_master_key', 'db_master_AES256_key_xyz789abc123', 'system', 9),
('api_gateway_token', 'agt_live_secure_token_a1b2c3d4e5f6', 'api_service', 8),
('encryption_master', 'enc_master_RSA4096_key_secret', 'encryption_service', 10),
('backup_encryption', 'backup_enc_key_2024_secure_xyz', 'backup_service', 9);

INSERT INTO crypto_wallets (wallet_address, private_key, seed_phrase, balance, owner_id) VALUES
('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', 'test test test test test test test test test test test junk', 100.5, 1),
('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about', 250.75, 2),
('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a', 'legal winner thank year wave sausage worth useful legal winner thank yellow', 500.00, 1);

INSERT INTO security_tokens (token_type, token_value, issued_to, expires_at) VALUES
('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', 1, datetime('now', '+7 days')),
('api_key', 'sk-prod-live-secure-key-abc123def456ghi789jkl012', 1, datetime('now', '+365 days')),
('refresh_token', 'rt_secure_refresh_xyz789abc123def456ghi789', 2, datetime('now', '+30 days')),
('access_token', 'at_temp_access_pqr901stu234vwx567yza890', 2, datetime('now', '+1 day'));