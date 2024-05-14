package com.javatodev.finance.service;

import com.javatodev.finance.configuration.KeycloakManager;
import com.javatodev.finance.exception.EntityNotFoundException;

import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.List;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KeycloakUserService {

    private final KeycloakManager keyCloakManager;

    public Integer createUser(UserRepresentation userRepresentation) {
        Response response = keyCloakManager.getKeyCloakInstanceWithRealm().users().create(userRepresentation);
        return response.getStatus();
    }

    public void updateUser(UserRepresentation userRepresentation) {
        keyCloakManager.getKeyCloakInstanceWithRealm().users().get(userRepresentation.getId()).update(userRepresentation);
    }


    public List<UserRepresentation> readUserByEmail(String email) {
        return keyCloakManager.getKeyCloakInstanceWithRealm().users().search(email);
    }


    public UserRepresentation readUser(String authId) {
        try {
            UserResource userResource = keyCloakManager.getKeyCloakInstanceWithRealm().users().get(authId);
            return userResource.toRepresentation();
        } catch (Exception e) {
            System.out.println(e);
            throw new EntityNotFoundException("User not found under given ID");
        }
    }
}
