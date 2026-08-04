package com.finance.control.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {

    @NotBlank(message = "O nome da categoria é obrigatório")
    private String name;

    @NotBlank(message = "O tipo é obrigatório (REVENUE ou EXPENSE)")
    private String type;

    private String color;
    private String icon;
}
