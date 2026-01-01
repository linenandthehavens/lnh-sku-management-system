package com.lnh.skumanagement.repository;

import com.lnh.skumanagement.repository.entity.SkuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkuRepository extends JpaRepository<SkuEntity, Long> {
    
    Optional<SkuEntity> findBySkuCode(String skuCode);
    
    List<SkuEntity> findByCategory(String category);
    
    @Query("SELECT s FROM SkuEntity s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.skuCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.category) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<SkuEntity> searchSkus(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT DISTINCT s.category FROM SkuEntity s ORDER BY s.category")
    List<String> findAllCategories();
}
