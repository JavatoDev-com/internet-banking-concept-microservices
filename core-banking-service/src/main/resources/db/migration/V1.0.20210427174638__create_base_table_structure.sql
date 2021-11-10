-- banking_core_service.banking_core_user definition

CREATE TABLE `banking_core_user`
(
    `id`                    bigint(20) NOT NULL AUTO_INCREMENT,
    `email`                 varchar(255) DEFAULT NULL,
    `first_name`            varchar(255) DEFAULT NULL,
    `identification_number` varchar(255) DEFAULT NULL,
    `last_name`             varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

-- banking_core_service.banking_core_account definition

CREATE TABLE `banking_core_account`
(
    `id`                bigint(20) NOT NULL AUTO_INCREMENT,
    `actual_balance`    decimal(19, 2) DEFAULT NULL,
    `available_balance` decimal(19, 2) DEFAULT NULL,
    `number`            varchar(255)   DEFAULT NULL,
    `status`            varchar(255)   DEFAULT NULL,
    `type`              varchar(255)   DEFAULT NULL,
    `user_id`           bigint(20) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY                 `FKt5uqy9p0v3rp3yhlgvm7ep0ij` (`user_id`),
    CONSTRAINT `FKt5uqy9p0v3rp3yhlgvm7ep0ij` FOREIGN KEY (`user_id`) REFERENCES `banking_core_user` (`id`)
);

-- banking_core_service.banking_core_account definition

CREATE TABLE `banking_core_utility_account`
(
    `id`            bigint(20) NOT NULL AUTO_INCREMENT,
    `number`        varchar(255) DEFAULT NULL,
    `provider_name` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
);
