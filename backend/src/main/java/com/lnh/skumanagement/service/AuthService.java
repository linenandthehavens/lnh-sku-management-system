package com.lnh.skumanagement.service;

import com.lnh.skumanagement.model.LoginRequest;

public interface AuthService {
    boolean loginUser(LoginRequest loginRequest);

    void createUser(LoginRequest loginRequest);
}
