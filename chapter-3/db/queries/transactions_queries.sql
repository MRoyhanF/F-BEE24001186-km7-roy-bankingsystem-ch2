-- Menambahkan transaksi baru
INSERT INTO transactions (account_id, type, amount, created_at, updated_at)
VALUES (1, 'deposit', 1500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Mengambil semua transaksi
SELECT * FROM transactions;

-- Mengambil transaksi tertentu berdasarkan ID
SELECT * FROM transactions
WHERE id = 1;

-- Mengupdate jenis transaksi
UPDATE transactions
SET type = 'withdraw', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Mengupdate jumlah transaksi
UPDATE transactions
SET amount = 1000, updated_at = CURRENT_TIMESTAMP
WHERE id = 2;

-- Menghapus transaksi berdasarkan ID
DELETE FROM transactions
WHERE id = 3;

-- Mengambil semua transaksi untuk akun tertentu
SELECT * FROM transactions
WHERE account_id = 1;

-- Mengambil total jumlah transaksi berdasarkan jenis
SELECT type, SUM(amount) AS total_amount
FROM transactions
GROUP BY type;

-- Mengambil transaksi terbaru untuk setiap akun
SELECT account_id, type, amount, created_at
FROM transactions
WHERE (account_id, created_at) IN (
    SELECT account_id, MAX(created_at)
    FROM transactions
    GROUP BY account_id
);
