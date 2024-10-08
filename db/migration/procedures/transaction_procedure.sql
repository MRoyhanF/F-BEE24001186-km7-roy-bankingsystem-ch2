-- Menghapus prosedur perform_transaction jika sudah ada
DROP PROCEDURE IF EXISTS perform_transaction;

-- Prosedur untuk Melakukan Transaksi
CREATE OR REPLACE PROCEDURE perform_transaction(
    p_account_id INT,
    p_transaction_type transaction_type,
    p_amount INT
) AS $$
BEGIN
    INSERT INTO transactions (account_id, type, amount, created_at, updated_at)
    VALUES (p_account_id, p_transaction_type, p_amount, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Memanggil prosedur perform_transaction
CALL perform_transaction(1, 'deposit', 500);  -- Melakukan deposit
CALL perform_transaction(1, 'withdraw', 300); -- Melakukan penarikan
