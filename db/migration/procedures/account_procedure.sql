-- Menghapus prosedur add_account jika sudah ada
DROP PROCEDURE IF EXISTS add_account;

-- Prosedur Menambah Akun
CREATE OR REPLACE PROCEDURE add_account(
    p_rekening_number INT,
    p_pin INT,
    p_balance INT DEFAULT 0
) AS $$
BEGIN
    INSERT INTO accounts (rekening_number, pin, balance, created_at, updated_at)
    VALUES (p_rekening_number, p_pin, p_balance, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Memanggil prosedur add_account
CALL add_account(100054301, 123456, 5000);


-- Menghapus prosedur update_balance jika sudah ada
DROP PROCEDURE IF EXISTS update_balance;

-- Prosedur untuk Mengupdate Saldo
CREATE OR REPLACE PROCEDURE update_balance(
    p_account_id INT,
    p_amount INT,
    p_transaction_type transaction_type
) AS $$
BEGIN
    IF p_transaction_type = 'deposit' THEN
        UPDATE accounts
        SET balance = balance + p_amount, updated_at = CURRENT_TIMESTAMP
        WHERE id = p_account_id;
    ELSIF p_transaction_type = 'withdraw' THEN
        IF (SELECT balance FROM accounts WHERE id = p_account_id) >= p_amount THEN
            UPDATE accounts
            SET balance = balance - p_amount, updated_at = CURRENT_TIMESTAMP
            WHERE id = p_account_id;
        ELSE
            RAISE EXCEPTION 'Insufficient balance for withdrawal';
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Memanggil prosedur update_balance
CALL update_balance(1, 2000, 'deposit');  -- Tambah saldo
CALL update_balance(1, 1000, 'withdraw'); -- Tarik saldo
