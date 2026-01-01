package com.lnh.skumanagement.service;

import com.lnh.skumanagement.model.Sku;

import java.util.List;

public interface SkuService {
    
    List<Sku> getAllSkus();
    
    Sku getSkuById(Long id);
    
    Sku getSkuByCode(String skuCode);
    
    Sku createSku(Sku sku);
    
    Sku updateSku(Long id, Sku sku);
    
    void deleteSku(Long id);
    
    List<Sku> searchSkus(String searchTerm);
    
    List<Sku> getSkusByCategory(String category);
    
    List<String> getAllCategories();
}
