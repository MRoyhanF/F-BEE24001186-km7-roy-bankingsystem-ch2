-- Menambahkan customer baru
INSERT INTO customers (account_id, name, address, phone, created_at, updated_at)
VALUES (1, 'Alice Johnson', '123 Main St', 1234567890, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Mengambil semua customer
SELECT * FROM customers;

-- Mengambil customer tertentu berdasarkan ID
SELECT * FROM customers
WHERE id = 1;

-- Mengupdate informasi customer
UPDATE customers
SET address = '456 Elm St', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Mengupdate nama customer
UPDATE customers
SET name = 'joko', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Menghapus customer berdasarkan ID
DELETE FROM customers
WHERE id = 3;

-- Mengambil semua customer dengan nomor telepon tertentu
SELECT * FROM customers
WHERE phone = 1234567890;

-- Mengambil jumlah customer yang ada
SELECT COUNT(*) AS total_customers FROM customers;
