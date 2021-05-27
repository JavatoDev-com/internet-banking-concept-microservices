-- banking_core_service.banking_core_transaction definition

CREATE TABLE `banking_core_transaction`
(
    `id`               bigint(20) NOT NULL AUTO_INCREMENT,
    `amount`           decimal(19, 2) DEFAULT NULL,
    `transaction_type` varchar(30) NOT NULL,
    `reference_number` varchar(50) NOT NULL,
    `transaction_id`   varchar(50) NOT NULL,
    `account_id`       bigint(20) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY                `FKk9w2ogq595jbe8r2due7vv3xr` (`account_id`),
    CONSTRAINT `FKk9w2ogq595jbe8r2due7vv3xr` FOREIGN KEY (`account_id`) REFERENCES `banking_core_account` (`id`)
);