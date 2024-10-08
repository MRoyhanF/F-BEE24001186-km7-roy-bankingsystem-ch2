-- Indexing pada kolom rekening_number
CREATE INDEX idx_accounts_rekening_number ON accounts (rekening_number);

-- Indexing pada kolom balance
CREATE INDEX idx_accounts_balance ON accounts (balance);
