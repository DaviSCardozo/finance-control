package com.finance.control.repository;

import com.finance.control.model.Category;
import com.finance.control.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.user.id = :userId")
    List<Category> findByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Category c WHERE c.user.id = :userId AND c.type = :type")
    List<Category> findByUserIdAndType(@Param("userId") Long userId, @Param("type") TransactionType type);

    @Query("SELECT c FROM Category c WHERE c.user.id = :userId AND c.id = :id")
    java.util.Optional<Category> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
}
