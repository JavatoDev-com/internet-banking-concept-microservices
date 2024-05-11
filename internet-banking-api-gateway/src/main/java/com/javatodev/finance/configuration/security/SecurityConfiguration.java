package com.javatodev.finance.configuration.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfiguration {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkUri;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        ServerHttpSecurity httpSecurity = http
            .authorizeExchange(exchanges ->
                //ALLOW OPTIONS REQUEST FOR CORS CONFIG ANGULAR APPLICATION
                exchanges.pathMatchers("/actuator/**").permitAll()
                    .pathMatchers("/user/api/v1/register").permitAll()
                    .anyExchange().authenticated()
            );

        httpSecurity.csrf(ServerHttpSecurity.CsrfSpec::disable);

        httpSecurity.oauth2ResourceServer(oAuth2ResourceServer -> oAuth2ResourceServer.jwt(jwt -> jwt.jwkSetUri(jwkUri)));

        return httpSecurity.build();

    }
}
