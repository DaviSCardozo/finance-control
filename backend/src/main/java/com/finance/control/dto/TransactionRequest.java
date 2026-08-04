package com.finance.control.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRequest {

    @NotNull(message = "A data é obrigatória")
    private LocalDate date;

    @NotBlank(message = "A descrição é obrigatória")
    private String description;

    @NotBlank(message = "O tipo é obrigatório (REVENUE ou EXPENSE)")
    private String type;

    @NotNull(message = "O valor é obrigatório")
    @Positive(message = "O valor deve ser positivo")
    private BigDecimal amount;

    private String status;

    private String observation;

    private Long categoryId;
}
