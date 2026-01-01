package com.lnh.skumanagement.service.impl;

import com.lnh.skumanagement.model.LoginRequest;
import com.lnh.skumanagement.repository.AuthRepository;
import com.lnh.skumanagement.repository.entity.LoginEntity;
import com.lnh.skumanagement.repository.mapper.AuthEntityMapper;
import com.lnh.skumanagement.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private static final int SALT_LENGTH = 16;
    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 256;

    private final AuthRepository authRepository;
    private final AuthEntityMapper authEntityMapper;

    @Override
    public void createUser(LoginRequest loginRequest) {
        byte[] salt = generateSalt();
        String hashedPassword = hashPassword(loginRequest.getPassword(), salt);
        loginRequest.setPassword(hashedPassword);
        loginRequest.setPasswordSalt(Base64.getEncoder().encodeToString(salt));
        authRepository.save(authEntityMapper.toLoginEntity(loginRequest));
    }

    @Override
    public boolean loginUser(LoginRequest loginRequest) {
        return validatePassword(loginRequest.getUserName(),loginRequest.getPassword());
    }

    private boolean validatePassword(String userName, String rawPassword) {
        Optional<LoginEntity>  loginEntityOptional = authRepository.findByUserName(userName);
        if(loginEntityOptional.isPresent()) {
            LoginEntity loginEntity = loginEntityOptional.get();
            byte[] salt = Base64.getDecoder().decode(loginEntity.getPasswordSalt());
            String hashedPassword = hashPassword(rawPassword, salt);
            return hashedPassword.equals(loginEntity.getPassword());
        }
        return false;
    }

    private byte[] generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[SALT_LENGTH];
        random.nextBytes(salt);
        return salt;
    }

    private String hashPassword(String password, byte[] salt) {
        try {
            KeySpec spec = new PBEKeySpec(
                    password.toCharArray(),
                    salt,
                    ITERATIONS,
                    KEY_LENGTH
            );
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hash = factory.generateSecret(spec).getEncoded();
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            log.error("Error hashing password", e);
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
