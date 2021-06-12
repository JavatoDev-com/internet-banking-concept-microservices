package com.javatodev.finance.configuration;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import reactor.core.publisher.Mono;

@Configuration
public class GatewayConfiguration {

    //setting auth-id for API requests.

    @Bean
    public GlobalFilter customGlobalFilter() {
        return ((exchange, chain) -> exchange.getPrincipal().map(principal -> {
            String userName = "";

            if (principal instanceof JwtAuthenticationToken) {
                //Get username from Principal
                userName = principal.getName();
            }
            // adds header to proxied request
            exchange.getRequest().mutate()
                    .header("X-Auth-Id", userName)
                    .build();
            return exchange;
        }).flatMap(chain::filter).then(Mono.fromRunnable(() -> {

        })));
    }

}
