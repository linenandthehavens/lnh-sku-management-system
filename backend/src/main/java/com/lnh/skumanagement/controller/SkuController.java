package com.lnh.skumanagement.controller;

import com.lnh.skumanagement.model.Sku;
import com.lnh.skumanagement.service.SkuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skus")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SkuController {

    private final SkuService skuService;

    @GetMapping
    public ResponseEntity<List<Sku>> getAllSkus() {
        return ResponseEntity.ok(skuService.getAllSkus());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sku> getSkuById(@PathVariable Long id) {
        return ResponseEntity.ok(skuService.getSkuById(id));
    }

    @GetMapping("/code/{skuCode}")
    public ResponseEntity<Sku> getSkuByCode(@PathVariable String skuCode) {
        return ResponseEntity.ok(skuService.getSkuByCode(skuCode));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Sku>> searchSkus(@RequestParam(required = false) String term) {
        return ResponseEntity.ok(skuService.searchSkus(term));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Sku>> getSkusByCategory(@PathVariable String category) {
        return ResponseEntity.ok(skuService.getSkusByCategory(category));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(skuService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<Sku> createSku(@Valid @RequestBody Sku sku) {
        Sku createdSku = skuService.createSku(sku);
        return new ResponseEntity<>(createdSku, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sku> updateSku(@PathVariable Long id, @Valid @RequestBody Sku sku) {
        Sku updatedSku = skuService.updateSku(id, sku);
        return ResponseEntity.ok(updatedSku);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteSku(@PathVariable Long id) {
        skuService.deleteSku(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
