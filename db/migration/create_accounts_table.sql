CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    rekening_number INT NOT NULL,
    pin INT NOT NULL CHECK (pin >= 100000 AND pin <= 999999),
    balance INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);