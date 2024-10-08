-- Seeder untuk tabel accounts
INSERT INTO accounts (rekening_number, pin, balance, created_at, updated_at)
SELECT
    (100000000 + n) AS rekening_number,
    (100000 + (RANDOM() * 900000)::INT) AS pin,
    (RANDOM() * 10000)::INT AS balance, 
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM generate_series(1, 10) AS n; 

-- Seeder untuk tabel customers
INSERT INTO customers (account_id, name, address, phone, created_at, updated_at)
SELECT
    id AS account_id,
    'Customer ' || n AS name, 
    'Address ' || n AS address,
    (1000000000 + n) AS phone,  
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM accounts, generate_series(1, 1) AS n; 

-- Seeder untuk tabel transactions
INSERT INTO transactions (account_id, type, amount, created_at, updated_at)
SELECT
    account_id,
    (CASE WHEN RANDOM() < 0.5 THEN 'deposit'::transaction_type ELSE 'withdraw'::transaction_type END) AS type,
    (100 + (RANDOM() * 9000)::INT) AS amount,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT account_id
    FROM customers
) AS cust, generate_series(1, 3) AS n;