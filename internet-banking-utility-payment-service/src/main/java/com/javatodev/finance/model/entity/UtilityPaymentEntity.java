package com.javatodev.finance.model.entity;

import com.javatodev.finance.model.TransactionStatus;
import com.javatodev.finance.model.dto.AuditAware;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "utility_payment")
public class UtilityPaymentEntity extends AuditAware {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long providerId;
    private BigDecimal amount;
    private String referenceNumber;
    private String account;
    private String transactionId;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

}
