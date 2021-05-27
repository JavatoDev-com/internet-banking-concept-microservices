package com.javatodev.finance.model.dto;

import com.fasterxml.jackson.annotation.JsonView;
import com.javatodev.finance.views.Views;
import lombok.Data;

@Data
public class User {
    @JsonView(Views.Public.class)
    private Long id;
    @JsonView(Views.Public.class)
    private String email;
    @JsonView(Views.Public.class)
    private String identification;
    private String password;
    private UserType type;
    @JsonView(Views.Public.class)
    private String authId;
    @JsonView(Views.Public.class)
    private Status status;
}
