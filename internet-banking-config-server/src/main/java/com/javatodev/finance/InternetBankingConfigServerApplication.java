package com.javatodev.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@EnableConfigServer
@SpringBootApplication
public class InternetBankingConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(InternetBankingConfigServerApplication.class, args);
    }

}
