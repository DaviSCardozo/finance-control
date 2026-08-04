package com.finance.control.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private BigDecimal currentBalance;
    private BigDecimal monthlyRevenues;
    private BigDecimal monthlyExpenses;
    private BigDecimal forecastedBalance;

    // Pie chart: expense category distribution
    private List<CategoryTotal> expensesByCategory;

    // Bar chart: monthly revenue vs expense for last 6 months
    private List<MonthlyComparison> monthlyComparison;

    // Line chart: accumulated balance evolution
    private List<BalancePoint> balanceEvolution;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryTotal {
        private String categoryName;
        private String categoryColor;
        private BigDecimal total;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyComparison {
        private String month;
        private BigDecimal revenues;
        private BigDecimal expenses;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BalancePoint {
        private String month;
        private BigDecimal balance;
    }
}
