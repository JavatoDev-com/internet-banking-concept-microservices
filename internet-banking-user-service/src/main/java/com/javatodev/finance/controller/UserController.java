package com.javatodev.finance.controller;

import com.javatodev.finance.model.dto.User;
import com.javatodev.finance.model.dto.UserUpdateRequest;
import com.javatodev.finance.service.KeycloakUserService;
import com.javatodev.finance.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Tag(name = "User Controller", description = "APIs for managing bank users")
@RestController
@RequestMapping(value = "/api/v1/bank-users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "Register User", description = "Create a new user in the banking system")
    @PostMapping(value = "/register")
    public ResponseEntity<User> createUser(@RequestBody User request) {
        log.info("Creating user with {}", request.toString());
        return ResponseEntity.ok(userService.createUser(request));
    }

    @Operation(summary = "Update User", description = "Update an existing user's information")
    @PatchMapping(value = "/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long userId, @RequestBody UserUpdateRequest userUpdateRequest) {
        log.info("Updating user with {}", userUpdateRequest.toString());
        return ResponseEntity.ok(userService.updateUser(userId, userUpdateRequest));
    }

    @Operation(summary = "Read Users", description = "Retrieve a paginated list of users")
    @GetMapping
    public ResponseEntity<List<User>> readUsers(Pageable pageable) {
        log.info("Reading all users from API");
        return ResponseEntity.ok(userService.readUsers(pageable));
    }

    @Operation(summary = "Read User by ID", description = "Retrieve a user's information by their ID")
    @GetMapping(value = "/{id}")
    public ResponseEntity<User> readUser(@PathVariable("id") Long id) {
        log.info("Reading user by id {}", id);
        return ResponseEntity.ok(userService.readUser(id));
    }

}
