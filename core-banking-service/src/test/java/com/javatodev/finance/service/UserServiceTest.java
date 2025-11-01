package com.javatodev.finance.service;

import com.javatodev.finance.exception.EntityNotFoundException;
import com.javatodev.finance.model.dto.User;
import com.javatodev.finance.model.entity.UserEntity;
import com.javatodev.finance.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {
    private UserRepository userRepository;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userService = new UserService(userRepository);
    }

    @Test
    void readUser_found() {
        UserEntity entity = new UserEntity();
        entity.setIdentificationNumber("ID123");
        when(userRepository.findByIdentificationNumber("ID123")).thenReturn(Optional.of(entity));
        User result = userService.readUser("ID123");
        assertNotNull(result);
        assertEquals("ID123", result.getIdentificationNumber());
    }

    @Test
    void readUser_notFound() {
        when(userRepository.findByIdentificationNumber("ID123")).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> userService.readUser("ID123"));
    }

    @Test
    void readUsers_success() {
        UserEntity entity = new UserEntity();
        entity.setIdentificationNumber("ID123");
        List<UserEntity> entities = Collections.singletonList(entity);
        Page<UserEntity> page = new PageImpl<>(entities);
        when(userRepository.findAll(any(Pageable.class))).thenReturn(page);
        List<User> result = userService.readUsers(Pageable.unpaged());
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("ID123", result.get(0).getIdentificationNumber());
    }
}
