package com.javatodev.finance.model.entity;

import com.javatodev.finance.model.dto.AuditAware;
import com.javatodev.finance.model.dto.Status;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user")
public class UserEntity extends AuditAware {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String authId;

    private String identification;

    @Enumerated(EnumType.STRING)
    private Status status;

}
