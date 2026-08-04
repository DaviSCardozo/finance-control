package com.finance.control.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private Long id;
    private LocalDate date;
    private String description;
    private String type;
    private BigDecimal amount;
    private String status;
    private String observation;

    // Category info
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
