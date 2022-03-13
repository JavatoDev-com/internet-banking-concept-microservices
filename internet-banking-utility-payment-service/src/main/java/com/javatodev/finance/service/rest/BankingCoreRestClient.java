package com.javatodev.finance.service.rest;

import com.javatodev.finance.configuration.CustomFeignClientConfiguration;
import com.javatodev.finance.model.rest.request.UtilityPaymentRequest;
import com.javatodev.finance.model.rest.response.AccountResponse;
import com.javatodev.finance.model.rest.response.UtilityPaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(name = "core-banking-service", configuration = CustomFeignClientConfiguration.class)
public interface BankingCoreRestClient {

    @RequestMapping(path = "/api/v1/account/bank-account/{account_number}", method = RequestMethod.GET)
    AccountResponse readAccount(@PathVariable("account_number") String accountNumber);

    @RequestMapping(path = "/api/v1/transaction/util-payment", method = RequestMethod.POST)
    UtilityPaymentResponse utilityPayment(@RequestBody UtilityPaymentRequest paymentRequest);

}
