package com.javatodev.finance.service;

import com.javatodev.finance.exception.EntityNotFoundException;
import com.javatodev.finance.model.dto.User;
import com.javatodev.finance.model.entity.UserEntity;
import com.javatodev.finance.model.mapper.UserMapper;
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
    private UserMapper userMapper;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userService = new UserService(userRepository);
        userMapper = spy(new UserMapper());
        // Inject the spy mapper if needed
        userService = Mockito.spy(userService);
        Mockito.doReturn(userMapper).when(userService).userMapper;
    }

    @Test
    void readUser_found() {
        UserEntity entity = new UserEntity();
        entity.setIdentificationNumber("ID123");
        User userDto = new User();
        userDto.setIdentificationNumber("ID123");
        when(userRepository.findByIdentificationNumber("ID123")).thenReturn(Optional.of(entity));
        doReturn(userDto).when(userMapper).convertToDto(entity);
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
        User userDto = new User();
        userDto.setIdentificationNumber("ID123");
        when(userRepository.findAll(any(Pageable.class))).thenReturn(page);
        doReturn(Collections.singletonList(userDto)).when(userMapper).convertToDtoList(entities);
        List<User> result = userService.readUsers(Pageable.unpaged());
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("ID123", result.get(0).getIdentificationNumber());
    }
}

