package com.javatodev.finance.service;

import com.javatodev.finance.exception.*;
import com.javatodev.finance.model.dto.Status;
import com.javatodev.finance.model.dto.User;
import com.javatodev.finance.model.dto.UserUpdateRequest;
import com.javatodev.finance.model.entity.UserEntity;
import com.javatodev.finance.model.mapper.UserMapper;
import com.javatodev.finance.model.repository.UserRepository;
import com.javatodev.finance.model.rest.response.UserResponse;
import com.javatodev.finance.service.rest.BankingCoreRestClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final SupabaseAuthService supabaseAuthService;
    private final UserRepository userRepository;
    private final BankingCoreRestClient bankingCoreRestClient;

    private UserMapper userMapper = new UserMapper();

    public User createUser(User user) {
        if (supabaseAuthService.emailExists(user.getEmail())) {
            throw new UserAlreadyRegisteredException(
                    "This email already registered as a user. Please check and retry.",
                    GlobalErrorCode.ERROR_EMAIL_REGISTERED);
        }

        UserResponse userResponse = bankingCoreRestClient.readUser(user.getIdentification());

        if (userResponse.getId() != null) {
            if (!userResponse.getEmail().equals(user.getEmail())) {
                throw new InvalidEmailException(
                        "Incorrect email. Please check and retry.",
                        GlobalErrorCode.ERROR_INVALID_EMAIL);
            }

            String authId = supabaseAuthService.createUser(
                    user.getEmail(),
                    user.getPassword(),
                    userResponse.getFirstName(),
                    userResponse.getLastName());

            log.info("User created in Supabase Auth for email={}", user.getEmail());
            user.setAuthId(authId);
            user.setStatus(Status.PENDING);
            user.setIdentification(userResponse.getIdentificationNumber());
            UserEntity save = userRepository.save(userMapper.convertToEntity(user));
            return userMapper.convertToDto(save);
        }

        throw new InvalidBankingUserException(
                "We couldn't find user under given identification. Please check and retry",
                GlobalErrorCode.ERROR_USER_NOT_FOUND_UNDER_NIC);
    }

    public List<User> readUsers(Pageable pageable) {
        Page<UserEntity> allUsersInDb = userRepository.findAll(pageable);
        List<User> users = userMapper.convertToDtoList(allUsersInDb.getContent());
        users.forEach(user -> {
            String email = supabaseAuthService.readUserEmail(user.getAuthId());
            user.setEmail(email);
        });
        return users;
    }

    public User readUser(Long userId) {
        return userMapper.convertToDto(userRepository.findById(userId).orElseThrow(EntityNotFoundException::new));
    }

    public User updateUser(Long id, UserUpdateRequest userUpdateRequest) {
        UserEntity userEntity = userRepository.findById(id).orElseThrow(EntityNotFoundException::new);

        if (userUpdateRequest.getStatus() == Status.APPROVED) {
            supabaseAuthService.confirmUser(userEntity.getAuthId());
        }

        userEntity.setStatus(userUpdateRequest.getStatus());
        return userMapper.convertToDto(userRepository.save(userEntity));
    }
}
