package com.javatodev.finance.model.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class User extends AuditAware {
    private Long id;

    private String email;

    private String identification;

    private String password;

    private String authId;

    private Status status;
}
