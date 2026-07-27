CREATE TABLE banking_core_transaction (
    id               BIGSERIAL PRIMARY KEY,
    amount           DECIMAL(19, 2),
    transaction_type VARCHAR(30) NOT NULL,
    reference_number VARCHAR(50) NOT NULL,
    transaction_id   VARCHAR(50) NOT NULL,
    account_id       BIGINT,
    CONSTRAINT fk_transaction_account FOREIGN KEY (account_id) REFERENCES banking_core_account (id)
);
