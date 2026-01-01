package com.lnh.skumanagement.service.impl;

import com.lnh.skumanagement.exception.DuplicateResourceException;
import com.lnh.skumanagement.exception.ResourceNotFoundException;
import com.lnh.skumanagement.model.Sku;
import com.lnh.skumanagement.repository.SkuRepository;
import com.lnh.skumanagement.repository.mapper.SkuEntityMapper;
import com.lnh.skumanagement.service.SkuService;
import com.lnh.skumanagement.util.SmartCapitalize;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SkuServiceImpl implements SkuService {

    private final SkuRepository skuRepository;
    private final SkuEntityMapper skuEntityMapper;
    private final SmartCapitalize smartCapitalize;
    
    @Override
    public List<Sku> getAllSkus() {
        return skuEntityMapper.toSkuList(skuRepository.findAll());
    }
    
    @Override
    public Sku getSkuById(Long id) {
        return skuEntityMapper.toSku(skuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SKU not found with id: " + id)));
    }
    
    @Override
    public Sku getSkuByCode(String skuCode) {
        return skuEntityMapper.toSku(skuRepository.findBySkuCode(skuCode)
                .orElseThrow(() -> new ResourceNotFoundException("SKU not found with code: " + skuCode)));
    }
    
    @Override
    public Sku createSku(Sku sku) {
        if (skuRepository.findBySkuCode(sku.getSkuCode()).isPresent()) {
            throw new DuplicateResourceException("SKU code already exists: " + sku.getSkuCode());
        }

        sku.setCategory(smartCapitalize.smartCapitalize(sku.getCategory()));
        sku.setName(smartCapitalize.smartCapitalize(sku.getName()));
        sku.setColour(smartCapitalize.smartCapitalize(sku.getColour()));
        sku.setStyleName(smartCapitalize.smartCapitalize(sku.getStyleName()));

        return skuEntityMapper.toSku(skuRepository.save(skuEntityMapper.toSkuEntity(sku)));
    }
    
    @Override
    public Sku updateSku(Long id, Sku skuDetails) {
        Sku sku = getSkuById(id);
        
        // Check if SKU code is being changed and if it conflicts with existing
        if (!sku.getSkuCode().equals(skuDetails.getSkuCode())) {
            if (skuRepository.findBySkuCode(skuDetails.getSkuCode()).isPresent()) {
                throw new DuplicateResourceException("SKU code already exists: " + skuDetails.getSkuCode());
            }
        }
        
        sku.setSkuCode(skuDetails.getSkuCode());
        sku.setName(smartCapitalize.smartCapitalize(skuDetails.getName()));
        sku.setDescription(skuDetails.getDescription());
        sku.setQuantity(skuDetails.getQuantity());
        sku.setPrice(skuDetails.getPrice());
        sku.setCategory(smartCapitalize.smartCapitalize(skuDetails.getCategory()));
        sku.setSupplier(skuDetails.getSupplier());
        sku.setStyleName(smartCapitalize.smartCapitalize(skuDetails.getStyleName()));
        sku.setColour(smartCapitalize.smartCapitalize(skuDetails.getColour()));
        
        return skuEntityMapper.toSku(skuRepository.save(skuEntityMapper.toSkuEntity(sku)));
    }
    
    @Override
    public void deleteSku(Long id) {
        Sku sku = getSkuById(id);
        skuRepository.delete(skuEntityMapper.toSkuEntity(sku));
    }
    
    @Override
    public List<Sku> searchSkus(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllSkus();
        }
        return skuEntityMapper.toSkuList(skuRepository.searchSkus(searchTerm));
    }
    
    @Override
    public List<Sku> getSkusByCategory(String category) {
        return skuEntityMapper.toSkuList(skuRepository.findByCategory(category));
    }
    
    @Override
    public List<String> getAllCategories() {
        return skuRepository.findAllCategories();
    }
}
