package com.javatodev.finance.configuration.keycloak;

import org.keycloak.admin.client.resource.RealmResource;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class KeycloakManager {

    private final KeycloakProperties keycloakProperties;

    public RealmResource getKeyCloakInstanceWithRealm() {
        return keycloakProperties.getInstance().realm(keycloakProperties.getRealm());
    }

}
