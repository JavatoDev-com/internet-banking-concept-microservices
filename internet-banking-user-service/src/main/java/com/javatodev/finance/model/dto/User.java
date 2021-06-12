package com.javatodev.finance.model.dto;

import lombok.Data;

@Data
public class User {
    private Long id;

    private String email;

    private String identification;

    private String password;

    private String authId;

    private Status status;
}
