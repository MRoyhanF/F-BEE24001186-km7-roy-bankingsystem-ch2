-- relasi dari tabel customer ke tabel account
ALTER TABLE customers
ADD CONSTRAINT fk_customer_account
FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;

-- relasi dari tabel transaction ke tabel account
ALTER TABLE transactions
ADD CONSTRAINT fk_transaction_account
FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE;