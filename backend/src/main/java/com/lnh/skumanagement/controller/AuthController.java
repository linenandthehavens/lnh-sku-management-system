package com.lnh.skumanagement.controller;

import com.lnh.skumanagement.model.LoginRequest;
import com.lnh.skumanagement.model.LoginResponse;
import com.lnh.skumanagement.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skus")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        boolean isValidCred = authService.loginUser(loginRequest);
        if (!isValidCred) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse());
        }
        // Generate JWT token upon successful login
        String token = "Login successful";
        LoginResponse response = new LoginResponse().token(token);
        return ResponseEntity.ok(new LoginResponse().token(token));
    }

    @PostMapping("/user")
    public ResponseEntity<Void> createUser(LoginRequest loginRequest) {
        authService.createUser(loginRequest);
        return ResponseEntity.noContent().build();
    }
}
