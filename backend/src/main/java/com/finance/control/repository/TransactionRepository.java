package com.finance.control.repository;

import com.finance.control.model.Transaction;
import com.finance.control.model.TransactionStatus;
import com.finance.control.model.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    // Paginated search with multiple optional filters
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:categoryId IS NULL OR t.category.id = :categoryId) " +
           "AND (:startDate IS NULL OR t.date >= :startDate) " +
           "AND (:endDate IS NULL OR t.date <= :endDate) " +
           "AND (:search IS NULL OR LOWER(t.description) LIKE LOWER(:search))")
    Page<Transaction> findAllFiltered(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("status") TransactionStatus status,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("search") String search,
            Pageable pageable
    );



    // For CSV export - same filters but no pagination
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:startDate IS NULL OR t.date >= :startDate) " +
           "AND (:endDate IS NULL OR t.date <= :endDate) " +
           "ORDER BY t.date DESC")
    List<Transaction> findAllForExport(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Dashboard Aggregations
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type AND t.status = 'CONFIRMED'")
    BigDecimal sumConfirmedByType(@Param("userId") Long userId, @Param("type") TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type AND t.status = 'CONFIRMED' " +
           "AND t.date >= :startDate AND t.date <= :endDate")
    BigDecimal sumConfirmedByTypeAndPeriod(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type AND t.status = 'PENDING' " +
           "AND t.date >= :startDate AND t.date <= :endDate")
    BigDecimal sumPendingByTypeAndPeriod(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Category distribution for current month expenses
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND t.type = 'EXPENSE' AND t.status = 'CONFIRMED' " +
           "AND t.date >= :startDate AND t.date <= :endDate")
    List<Transaction> findConfirmedExpensesByPeriod(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Historical transactions for chart building
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND t.status = 'CONFIRMED' " +
           "AND t.date >= :startDate AND t.date <= :endDate " +
           "ORDER BY t.date ASC")
    List<Transaction> findConfirmedByPeriod(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    List<Transaction> findByUserId(Long userId);
}
