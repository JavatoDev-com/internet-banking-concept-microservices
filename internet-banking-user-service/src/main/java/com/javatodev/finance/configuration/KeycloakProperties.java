package com.javatodev.finance.configuration;

import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KeycloakProperties {
    @Value("${app.config.keycloak.server-url}")
    private String serverUrl;

    @Value("${app.config.keycloak.realm}")
    private String realm;

    @Value("${app.config.keycloak.clientId}")
    private String clientId;

    @Value("${app.config.keycloak.client-secret}")
    private String clientSecret;

    private static Keycloak keycloakInstance = null;

    public Keycloak getInstance() {

        if (keycloakInstance == null) {
            keycloakInstance = KeycloakBuilder
                    .builder()
                    .serverUrl(serverUrl)
                    .realm(realm)
                    .grantType("client_credentials")
                    .clientId(clientId)
                    .clientSecret(clientSecret)
                    .build();
        }
        return keycloakInstance;
    }

    public String getRealm() {
        return realm;
    }
}
