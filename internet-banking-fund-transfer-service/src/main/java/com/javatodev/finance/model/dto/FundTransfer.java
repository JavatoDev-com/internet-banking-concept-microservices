package com.javatodev.finance.model.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FundTransfer {
    private Long id;
    private String transactionReference;
    private String status;
    private String fromAccount;
    private String toAccount;
    private BigDecimal amount;
}
