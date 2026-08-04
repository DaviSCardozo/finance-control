package com.finance.control.service;

import com.finance.control.dto.TransactionRequest;
import com.finance.control.dto.TransactionResponse;
import com.finance.control.model.*;
import com.finance.control.repository.CategoryRepository;
import com.finance.control.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public Page<TransactionResponse> getTransactions(
            TransactionType type,
            TransactionStatus status,
            Long categoryId,
            LocalDate startDate,
            LocalDate endDate,
            String search,
            Pageable pageable
    ) {
        User user = userService.getCurrentUser();
        Page<Transaction> page = transactionRepository.findAllFiltered(
                user.getId(), type, status, categoryId, startDate, endDate, search, pageable
        );
        return page.map(this::toResponse);
    }

    public TransactionResponse getTransaction(Long id) {
        User user = userService.getCurrentUser();
        Transaction tx = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Lançamento não encontrado"));
        return toResponse(tx);
    }

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        User user = userService.getCurrentUser();
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findByIdAndUserId(request.getCategoryId(), user.getId())
                    .orElse(null);
        }

        Transaction tx = Transaction.builder()
                .date(request.getDate())
                .description(request.getDescription())
                .type(TransactionType.valueOf(request.getType()))
                .amount(request.getAmount())
                .status(request.getStatus() != null ?
                        TransactionStatus.valueOf(request.getStatus()) : TransactionStatus.CONFIRMED)
                .observation(request.getObservation())
                .category(category)
                .user(user)
                .build();

        return toResponse(transactionRepository.save(tx));
    }

    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        User user = userService.getCurrentUser();
        Transaction tx = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Lançamento não encontrado"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findByIdAndUserId(request.getCategoryId(), user.getId())
                    .orElse(null);
        }

        tx.setDate(request.getDate());
        tx.setDescription(request.getDescription());
        tx.setType(TransactionType.valueOf(request.getType()));
        tx.setAmount(request.getAmount());
        tx.setStatus(request.getStatus() != null ?
                TransactionStatus.valueOf(request.getStatus()) : tx.getStatus());
        tx.setObservation(request.getObservation());
        tx.setCategory(category);

        return toResponse(transactionRepository.save(tx));
    }

    @Transactional
    public void deleteTransaction(Long id) {
        User user = userService.getCurrentUser();
        Transaction tx = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Lançamento não encontrado"));
        transactionRepository.delete(tx);
    }

    public String exportCsv(TransactionType type, LocalDate startDate, LocalDate endDate) {
        User user = userService.getCurrentUser();
        List<Transaction> transactions = transactionRepository.findAllForExport(
                user.getId(), type, startDate, endDate
        );

        StringBuilder csv = new StringBuilder();
        csv.append("Data,Descrição,Tipo,Valor,Status,Categoria,Observação\n");

        for (Transaction tx : transactions) {
            csv.append(tx.getDate()).append(",");
            csv.append(escapeCsv(tx.getDescription())).append(",");
            csv.append(tx.getType() == TransactionType.REVENUE ? "Receita" : "Despesa").append(",");
            csv.append(tx.getAmount()).append(",");
            csv.append(tx.getStatus() == TransactionStatus.CONFIRMED ? "Confirmado" : "Pendente").append(",");
            csv.append(tx.getCategory() != null ? escapeCsv(tx.getCategory().getName()) : "").append(",");
            csv.append(tx.getObservation() != null ? escapeCsv(tx.getObservation()) : "").append("\n");
        }

        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private TransactionResponse toResponse(Transaction tx) {
        return TransactionResponse.builder()
                .id(tx.getId())
                .date(tx.getDate())
                .description(tx.getDescription())
                .type(tx.getType().name())
                .amount(tx.getAmount())
                .status(tx.getStatus().name())
                .observation(tx.getObservation())
                .categoryId(tx.getCategory() != null ? tx.getCategory().getId() : null)
                .categoryName(tx.getCategory() != null ? tx.getCategory().getName() : null)
                .categoryColor(tx.getCategory() != null ? tx.getCategory().getColor() : null)
                .categoryIcon(tx.getCategory() != null ? tx.getCategory().getIcon() : null)
                .createdAt(tx.getCreatedAt())
                .updatedAt(tx.getUpdatedAt())
                .build();
    }
}
