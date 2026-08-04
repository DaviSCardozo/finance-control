package com.finance.control.service;

import com.finance.control.dto.DashboardResponse;
import com.finance.control.model.Transaction;
import com.finance.control.model.TransactionType;
import com.finance.control.model.User;
import com.finance.control.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserService userService;

    public DashboardResponse getDashboard() {
        User user = userService.getCurrentUser();
        Long userId = user.getId();

        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate monthEnd = YearMonth.from(now).atEndOfMonth();

        // Current Balance: all-time confirmed revenues - all-time confirmed expenses
        BigDecimal totalRevenues = transactionRepository.sumConfirmedByType(userId, TransactionType.REVENUE);
        BigDecimal totalExpenses = transactionRepository.sumConfirmedByType(userId, TransactionType.EXPENSE);
        BigDecimal currentBalance = totalRevenues.subtract(totalExpenses);

        // Monthly totals (confirmed)
        BigDecimal monthlyRevenues = transactionRepository.sumConfirmedByTypeAndPeriod(
                userId, TransactionType.REVENUE, monthStart, monthEnd);
        BigDecimal monthlyExpenses = transactionRepository.sumConfirmedByTypeAndPeriod(
                userId, TransactionType.EXPENSE, monthStart, monthEnd);

        // Forecasted Balance: current balance + pending revenues - pending expenses (this month)
        BigDecimal pendingRevenues = transactionRepository.sumPendingByTypeAndPeriod(
                userId, TransactionType.REVENUE, monthStart, monthEnd);
        BigDecimal pendingExpenses = transactionRepository.sumPendingByTypeAndPeriod(
                userId, TransactionType.EXPENSE, monthStart, monthEnd);
        BigDecimal forecastedBalance = currentBalance.add(pendingRevenues).subtract(pendingExpenses);

        // Expense distribution by category (current month, confirmed)
        List<Transaction> monthExpenses = transactionRepository.findConfirmedExpensesByPeriod(
                userId, monthStart, monthEnd);

        Map<String, DashboardResponse.CategoryTotal> categoryMap = new LinkedHashMap<>();
        for (Transaction tx : monthExpenses) {
            String catName = tx.getCategory() != null ? tx.getCategory().getName() : "Sem categoria";
            String catColor = tx.getCategory() != null ? tx.getCategory().getColor() : "#6B7280";

            categoryMap.merge(catName,
                    DashboardResponse.CategoryTotal.builder()
                            .categoryName(catName)
                            .categoryColor(catColor)
                            .total(tx.getAmount())
                            .build(),
                    (existing, newVal) -> {
                        existing.setTotal(existing.getTotal().add(newVal.getTotal()));
                        return existing;
                    }
            );
        }
        List<DashboardResponse.CategoryTotal> expensesByCategory = new ArrayList<>(categoryMap.values());

        // Monthly comparison (last 6 months)
        List<DashboardResponse.MonthlyComparison> monthlyComparison = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = YearMonth.from(now).minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            String monthName = ym.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));
            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);

            BigDecimal rev = transactionRepository.sumConfirmedByTypeAndPeriod(userId, TransactionType.REVENUE, start, end);
            BigDecimal exp = transactionRepository.sumConfirmedByTypeAndPeriod(userId, TransactionType.EXPENSE, start, end);

            monthlyComparison.add(DashboardResponse.MonthlyComparison.builder()
                    .month(monthName)
                    .revenues(rev)
                    .expenses(exp)
                    .build());
        }

        // Balance evolution (last 6 months - cumulative)
        List<DashboardResponse.BalancePoint> balanceEvolution = new ArrayList<>();
        BigDecimal cumulativeBalance = BigDecimal.ZERO;

        // Calculate balance before the 6-month window
        LocalDate sixMonthsAgo = YearMonth.from(now).minusMonths(5).atDay(1);
        BigDecimal revBefore = transactionRepository.sumConfirmedByTypeAndPeriod(
                userId, TransactionType.REVENUE, LocalDate.of(2000, 1, 1), sixMonthsAgo.minusDays(1));
        BigDecimal expBefore = transactionRepository.sumConfirmedByTypeAndPeriod(
                userId, TransactionType.EXPENSE, LocalDate.of(2000, 1, 1), sixMonthsAgo.minusDays(1));
        cumulativeBalance = revBefore.subtract(expBefore);

        for (int i = 5; i >= 0; i--) {
            YearMonth ym = YearMonth.from(now).minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            String monthName = ym.getMonth().getDisplayName(TextStyle.SHORT, new Locale("pt", "BR"));
            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);

            BigDecimal rev = transactionRepository.sumConfirmedByTypeAndPeriod(userId, TransactionType.REVENUE, start, end);
            BigDecimal exp = transactionRepository.sumConfirmedByTypeAndPeriod(userId, TransactionType.EXPENSE, start, end);
            cumulativeBalance = cumulativeBalance.add(rev).subtract(exp);

            balanceEvolution.add(DashboardResponse.BalancePoint.builder()
                    .month(monthName)
                    .balance(cumulativeBalance)
                    .build());
        }

        return DashboardResponse.builder()
                .currentBalance(currentBalance)
                .monthlyRevenues(monthlyRevenues)
                .monthlyExpenses(monthlyExpenses)
                .forecastedBalance(forecastedBalance)
                .expensesByCategory(expensesByCategory)
                .monthlyComparison(monthlyComparison)
                .balanceEvolution(balanceEvolution)
                .build();
    }
}
