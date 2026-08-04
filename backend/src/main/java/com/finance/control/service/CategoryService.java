package com.finance.control.service;

import com.finance.control.dto.CategoryRequest;
import com.finance.control.model.Category;
import com.finance.control.model.TransactionType;
import com.finance.control.model.User;
import com.finance.control.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public List<Category> getAllCategories() {
        User user = userService.getCurrentUser();
        return categoryRepository.findByUserId(user.getId());
    }

    public List<Category> getCategoriesByType(TransactionType type) {
        User user = userService.getCurrentUser();
        return categoryRepository.findByUserIdAndType(user.getId(), type);
    }

    @Transactional
    public Category createCategory(CategoryRequest request) {
        User user = userService.getCurrentUser();

        Category category = Category.builder()
                .name(request.getName())
                .type(TransactionType.valueOf(request.getType()))
                .color(request.getColor() != null ? request.getColor() : "#6B7280")
                .icon(request.getIcon() != null ? request.getIcon() : "HelpCircle")
                .user(user)
                .build();

        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        User user = userService.getCurrentUser();
        Category category = categoryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        categoryRepository.delete(category);
    }
}
