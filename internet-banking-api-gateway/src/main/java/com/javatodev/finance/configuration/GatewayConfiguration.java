package com.javatodev.finance.configuration;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

import java.security.Principal;

@Configuration
public class GatewayConfiguration {

    private static final String HTTP_HEADER_AUTH_USER_ID = "X-Auth-Id";
    private static final String UNAUTHORIZED_USER_NAME = "SYSTEM USER";

    @Bean
    public GlobalFilter customGlobalFilter() {
        return (exchange, chain) -> exchange.getPrincipal().map(Principal::getName).defaultIfEmpty(UNAUTHORIZED_USER_NAME).map(principal -> {
            // adds header to proxied request
            exchange.getRequest().mutate()
                    .header(HTTP_HEADER_AUTH_USER_ID, principal)
                    .build();
            return exchange;
        }).flatMap(chain::filter).then(Mono.fromRunnable(() -> {

        }));
    }

}
