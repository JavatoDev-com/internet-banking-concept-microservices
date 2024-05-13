package com.javatodev.finance.model.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class Transaction {

    private Long id;
    private BigDecimal amount;
    private BankAccount bankAccount;
    private String referenceNumber;

}
