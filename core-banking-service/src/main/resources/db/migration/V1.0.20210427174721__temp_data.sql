INSERT INTO banking_core_user (id, email, first_name, identification_number, last_name)
VALUES ('1', 'sam@gmail.com', 'Sam', '808829932V', 'Silva');
INSERT INTO banking_core_service.banking_core_user (id, email, first_name, identification_number, last_name)
VALUES ('2', 'guru@gmail.com', 'Guru', '901830556V', 'Darmaraj');
INSERT INTO banking_core_service.banking_core_user (id, email, first_name, identification_number, last_name)
VALUES ('3', 'ragu@gmail.com', 'Ragu', '348829932V', 'Sivaraj');
INSERT INTO banking_core_service.banking_core_user (id, email, first_name, identification_number, last_name)
VALUES ('4', 'randor@gmail.com', 'Randor', '842829932V', 'Manoon');

INSERT INTO banking_core_account
    (actual_balance, available_balance, `number`, status, `type`, user_id)
VALUES (100000.00, 100000.00, 100015003000, 'ACTIVE', 'SAVINGS_ACCOUNT', '1'),
       (100000.00, 100000.00, 100015003001, 'ACTIVE', 'SAVINGS_ACCOUNT', '1'),
       (100000.00, 100000.00, 100015003002, 'ACTIVE', 'SAVINGS_ACCOUNT', '2'),
       (12000.00, 12000.00, 100015003003, 'ACTIVE', 'SAVINGS_ACCOUNT', '2'),
       (12000.00, 12000.00, 100015003004, 'ACTIVE', 'SAVINGS_ACCOUNT', '2'),
       (12000.00, 12000.00, 100015003005, 'ACTIVE', 'SAVINGS_ACCOUNT', '3'),
       (290000.00, 290000.00, 100015003006, 'ACTIVE', 'SAVINGS_ACCOUNT', '3'),
       (290000.00, 290000.00, 100015003007, 'ACTIVE', 'SAVINGS_ACCOUNT', '3'),
       (290000.00, 290000.00, 100015003008, 'ACTIVE', 'SAVINGS_ACCOUNT', '3'),
       (365023.00, 365023.00, 100015003009, 'ACTIVE', 'SAVINGS_ACCOUNT', '3'),
       (365023.00, 365023.00, 100015003010, 'ACTIVE', 'SAVINGS_ACCOUNT', '4'),
       (365023.00, 89456.00, 100015003011, 'ACTIVE', 'SAVINGS_ACCOUNT', '4'),
       (89456.00, 89456.00, 100015003012, 'ACTIVE', 'SAVINGS_ACCOUNT', '4'),
       (889000.33, 889000.33, 100015003013, 'ACTIVE', 'SAVINGS_ACCOUNT', '4');


INSERT INTO banking_core_utility_account (`number`, provider_name)
VALUES ('8203232565', 'VODAFONE');
INSERT INTO banking_core_utility_account (`number`, provider_name)
VALUES ('5464546545', 'VERIZON');
INSERT INTO banking_core_utility_account (`number`, provider_name)
VALUES ('6546456464', 'SINGTEL');
INSERT INTO banking_core_utility_account (`number`, provider_name)
VALUES ('7889987999', 'HUTCH');
INSERT INTO banking_core_utility_account (`number`, provider_name)
VALUES ('2132123132', 'AIRTEL');
INSERT INTO banking_core_utility_account (`number`, provider_name)
VALUES ('61645564646', 'GIO');
