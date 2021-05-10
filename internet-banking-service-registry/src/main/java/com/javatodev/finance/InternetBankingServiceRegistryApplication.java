package com.javatodev.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@EnableEurekaServer
@SpringBootApplication
public class InternetBankingServiceRegistryApplication {

    public static void main(String[] args) {
        SpringApplication.run(InternetBankingServiceRegistryApplication.class, args);
    }

}
