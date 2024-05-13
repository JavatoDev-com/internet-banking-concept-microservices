package com.javatodev.finance.model.dto;

import com.javatodev.finance.model.TransactionStatus;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class UtilityPayment {
    private Long providerId;
    private BigDecimal amount;
    private String referenceNumber;
    private String account;
    private TransactionStatus status;
}
