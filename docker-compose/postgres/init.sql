-- Create additional databases for each banking service.
-- The default database (banking_core_service) is created by POSTGRES_DB env var.
CREATE DATABASE banking_core_user_service;
CREATE DATABASE banking_core_fund_transfer_service;
CREATE DATABASE banking_core_utility_payment_service;
