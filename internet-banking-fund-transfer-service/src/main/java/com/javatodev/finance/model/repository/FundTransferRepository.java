package com.javatodev.finance.model.repository;

import com.javatodev.finance.model.entity.FundTransferEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FundTransferRepository extends JpaRepository<FundTransferEntity, Long> {
}
