-- Menambahkan akun baru
INSERT INTO accounts (rekening_number, pin, balance, created_at, updated_at)
VALUES (100000001, 123456, 5000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Mengambil semua akun
SELECT * FROM accounts;

-- Mengambil akun tertentu berdasarkan rekening_number
SELECT * FROM accounts
WHERE rekening_number = 100000001;

-- Mengupdate saldo akun
UPDATE accounts
SET balance = balance + 1000, updated_at = CURRENT_TIMESTAMP
WHERE rekening_number = 100000001;

-- Mengupdate PIN akun
UPDATE accounts
SET pin = 789012, updated_at = CURRENT_TIMESTAMP
WHERE rekening_number = 100000002;

-- Menghapus akun berdasarkan rekening_number
DELETE FROM accounts
WHERE rekening_number = 100000003;

-- Mengambil semua akun dengan saldo lebih dari 1000
SELECT * FROM accounts
WHERE balance > 1000;

-- Mengambil jumlah akun yang ada
SELECT COUNT(*) AS total_accounts FROM accounts;
