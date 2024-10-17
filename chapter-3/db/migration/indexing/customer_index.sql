-- indexing pada kolom account_id
CREATE INDEXing idx_customers_account_id ON customers (account_id);

-- Indexing pada kolom name
CREATE INDEX idx_customers_name ON customers (name);
