package com.javatodev.finance.controller;

import com.javatodev.finance.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Tag(name = "User Controller", description = "APIs for managing users")
@RestController
@RequestMapping(value = "/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final MessageSource messageSource;

    @Operation(summary = "Read User by Identification", description = "Retrieve a user's information by their identification")
    @GetMapping(value = "/{identification}")
    public ResponseEntity readUser(@PathVariable("identification") String identification) {
        return ResponseEntity.ok(userService.readUser(identification));
    }

    @Operation(summary = "Read Users", description = "Retrieve a paginated list of users")
    @GetMapping
    public ResponseEntity readUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.readUsers(pageable));
    }

}
