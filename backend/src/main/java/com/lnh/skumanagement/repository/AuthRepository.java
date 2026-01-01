package com.lnh.skumanagement.repository;

import com.lnh.skumanagement.repository.entity.LoginEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<LoginEntity, Long> {

    Optional<LoginEntity> findByUserName(String userName);
}
