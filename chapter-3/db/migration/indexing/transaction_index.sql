-- Indexing pada kolom account_id
CREATE INDEX idx_transactions_account_id ON transactions (account_id);

-- Indexing pada kolom type
CREATE INDEX idx_transactions_type ON transactions (type);

-- Indexing pada kolom amount
CREATE INDEX idx_transactions_amount ON transactions (amount);
