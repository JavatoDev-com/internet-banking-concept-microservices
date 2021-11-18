package com.javatodev.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableEurekaClient
@EnableFeignClients
@SpringBootApplication
public class InternetBankingUtilityPaymentServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(InternetBankingUtilityPaymentServiceApplication.class, args);
	}

}
