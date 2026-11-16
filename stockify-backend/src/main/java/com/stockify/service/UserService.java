package com.stockify.service;

import com.stockify.config.JwtTokenProvider;
import com.stockify.dto.AuthResponse;
import com.stockify.dto.LoginRequest;
import com.stockify.dto.RegisterRequest;
import com.stockify.model.User;
import com.stockify.model.UserLogin;
import com.stockify.repository.UserLoginRepository;
import com.stockify.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserLoginRepository userLoginRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, UserLoginRepository userLoginRepository, 
                       PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.userLoginRepository = userLoginRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .message("Registration successful")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Track user login
        UserLogin loginRecord = UserLogin.builder()
                .user(user)
                .build();
        userLoginRepository.save(loginRecord);

        // Send Enhanced Login Notification
        emailService.sendEnhancedLoginNotification(user.getEmail(), user.getFullName());

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .message("Login successful")
                .build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
