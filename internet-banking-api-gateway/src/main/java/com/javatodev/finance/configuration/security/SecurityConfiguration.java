package com.javatodev.finance.configuration.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfiguration {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkUri;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        ServerHttpSecurity httpSecurity = http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeExchange(exchanges -> {

                //ALLOW USER REGISTRATION API ENDPOINT
                exchanges.pathMatchers("/user/api/v1/bank-users/register").permitAll();

                //ALLOW ACTUATOR ENDPOINTS
                exchanges.pathMatchers("/actuator/**").permitAll()
                    .pathMatchers("/user/actuator/**").permitAll()
                    .pathMatchers("/fund-transfer/actuator/**").permitAll()
                    .pathMatchers("/banking-core/actuator/**").permitAll()
                    .pathMatchers("/utility-payment/actuator/**").permitAll()
                    .anyExchange().authenticated();
            });

        httpSecurity.csrf(ServerHttpSecurity.CsrfSpec::disable);

        httpSecurity.oauth2ResourceServer(oAuth2ResourceServer -> oAuth2ResourceServer.jwt(jwt -> jwt.jwkSetUri(jwkUri)));

        return httpSecurity.build();

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
