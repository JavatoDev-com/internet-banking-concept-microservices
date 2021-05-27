package com.javatodev.finance.model.dto.mapper;

import com.javatodev.finance.mapper.BaseMapper;
import com.javatodev.finance.model.dto.User;
import com.javatodev.finance.model.entity.UserEntity;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.BeanUtils;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper extends BaseMapper<UserEntity, User> {
    @Override
    public UserEntity convertToEntity(User dto, Object... args) {
        UserEntity userEntity = new UserEntity();
        if (dto != null) {
            BeanUtils.copyProperties(dto, userEntity);
        }
        return userEntity;
    }

    @Override
    public User convertToDto(UserEntity entity, Object... args) {
        User user = new User();
        if (entity != null) {
            BeanUtils.copyProperties(entity, user);
        }
        return user;
    }

    public User convertToDto(UserRepresentation userRepresentation) {
        User user = new User();
        if (userRepresentation != null) {
            user.setAuthId(userRepresentation.getId());
            user.setEmail(userRepresentation.getEmail());
        }
        return user;
    }

    public List<User> convertToDtoList(List<UserRepresentation> userRepresentations) {
        return userRepresentations.stream().map(this::convertToDto).collect(Collectors.toList());
    }

}
