package com.javatodev.finance.model.dto.response;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class AccountResponse {
    private Long number;
    private BigDecimal actualBalance;
    private Long id;
    private String type;
    private String status;
    private BigDecimal availableBalance;
}
