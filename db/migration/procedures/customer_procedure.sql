-- Menghapus prosedur add_customer jika sudah ada
DROP PROCEDURE IF EXISTS add_customer;

-- Prosedur Menambah Customer
CREATE OR REPLACE PROCEDURE add_customer(
    p_account_id INT,
    p_name VARCHAR,
    p_address VARCHAR,
    p_phone INT
) AS $$
BEGIN
    INSERT INTO customers (account_id, name, address, phone, created_at, updated_at)
    VALUES (p_account_id, p_name, p_address, p_phone, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Memanggil prosedur add_customer
CALL add_customer(1, 'John Doe', '123 Elm Street', 1234567890);


-- Menghapus prosedur delete_customer_and_account
DROP PROCEDURE IF EXISTS delete_customer_and_account;

-- Prosedur Menghapus Customer dan Akun
CREATE OR REPLACE PROCEDURE delete_customer_and_account(
    p_customer_id INT
) AS $$
DECLARE
    v_account_id INT;
BEGIN
    SELECT account_id INTO v_account_id FROM customers WHERE id = p_customer_id;
    
    DELETE FROM customers WHERE id = p_customer_id;

    DELETE FROM accounts WHERE id = v_account_id;
END;
$$ LANGUAGE plpgsql;

-- Memanggil prosedur delete_customer_and_account
CALL delete_customer_and_account(1); 
