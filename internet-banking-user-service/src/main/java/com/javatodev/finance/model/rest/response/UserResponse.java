package com.javatodev.finance.model.rest.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserResponse {
    private String firstName;
    private String lastName;
    private List<AccountResponse> bankAccounts;
    private String identificationNumber;
    private Integer id;
    private String email;
}
