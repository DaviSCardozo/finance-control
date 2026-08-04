package com.finance.control.service;

import com.finance.control.dto.AuthResponse;
import com.finance.control.dto.LoginRequest;
import com.finance.control.dto.RegisterRequest;
import com.finance.control.model.*;
import com.finance.control.repository.CategoryRepository;
import com.finance.control.repository.UserRepository;
import com.finance.control.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username já existe!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já cadastrado!");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName() != null ? request.getFullName() : request.getUsername())
                .build();

        User savedUser = userRepository.save(user);

        // Seed default categories for new user
        seedDefaultCategories(savedUser);

        var userDetails = new org.springframework.security.core.userdetails.User(
                savedUser.getUsername(),
                savedUser.getPassword(),
                new ArrayList<>()
        );
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Seed default categories if empty
        if (categoryRepository.findByUserId(user.getId()).isEmpty()) {
            seedDefaultCategories(user);
        }

        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
        );
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }

    private void seedDefaultCategories(User user) {
        List<Category> defaults = new ArrayList<>();

        // Revenue categories
        defaults.add(Category.builder().name("Salário").type(TransactionType.REVENUE).color("#10B981").icon("DollarSign").user(user).build());
        defaults.add(Category.builder().name("Uber").type(TransactionType.REVENUE).color("#059669").icon("Car").user(user).build());
        defaults.add(Category.builder().name("Freelancer").type(TransactionType.REVENUE).color("#3B82F6").icon("Briefcase").user(user).build());
        defaults.add(Category.builder().name("PIX").type(TransactionType.REVENUE).color("#2563EB").icon("Send").user(user).build());
        defaults.add(Category.builder().name("Bonificação").type(TransactionType.REVENUE).color("#8B5CF6").icon("Gift").user(user).build());

        // Expense categories
        defaults.add(Category.builder().name("Água").type(TransactionType.EXPENSE).color("#3B82F6").icon("Droplet").user(user).build());
        defaults.add(Category.builder().name("Luz").type(TransactionType.EXPENSE).color("#F59E0B").icon("Zap").user(user).build());
        defaults.add(Category.builder().name("Internet").type(TransactionType.EXPENSE).color("#6366F1").icon("Wifi").user(user).build());
        defaults.add(Category.builder().name("Faculdade").type(TransactionType.EXPENSE).color("#8B5CF6").icon("GraduationCap").user(user).build());
        defaults.add(Category.builder().name("Mercado").type(TransactionType.EXPENSE).color("#059669").icon("ShoppingCart").user(user).build());
        defaults.add(Category.builder().name("Alimentação").type(TransactionType.EXPENSE).color("#10B981").icon("Utensils").user(user).build());
        defaults.add(Category.builder().name("Transporte").type(TransactionType.EXPENSE).color("#EF4444").icon("Bus").user(user).build());
        defaults.add(Category.builder().name("Cartão").type(TransactionType.EXPENSE).color("#EC4899").icon("CreditCard").user(user).build());
        defaults.add(Category.builder().name("Saúde").type(TransactionType.EXPENSE).color("#F43F5E").icon("Heart").user(user).build());
        defaults.add(Category.builder().name("Outros").type(TransactionType.EXPENSE).color("#6B7280").icon("HelpCircle").user(user).build());

        categoryRepository.saveAll(defaults);
    }
}
