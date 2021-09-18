package com.javatodev.finance.controller;

import com.javatodev.finance.model.dto.request.FundTransferRequest;
import com.javatodev.finance.service.FundTransferService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/transfer")
public class FundTransferController {

    private final FundTransferService fundTransferService;

    @PostMapping
    public ResponseEntity sendFundTransfer(@RequestBody FundTransferRequest fundTransferRequest) {
        log.info("Got fund transfer request from API {}", fundTransferRequest.toString());
        return ResponseEntity.ok(fundTransferService.fundTransfer(fundTransferRequest));
    }

    @GetMapping
    public ResponseEntity readFundTransfers (Pageable pageable) {
        log.info("Reading fund transfers from core");
        return ResponseEntity.ok(fundTransferService.readAllTransfers(pageable));
    }
}
