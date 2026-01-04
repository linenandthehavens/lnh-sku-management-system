package com.lnh.skumanagement.repository.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "skus")
@Data
public class SkuEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "SKU code is required")
    @Column(name = "sku_code" ,unique = true, nullable = false)
    private String skuCode;

    @NotBlank(message = "Product name is required")
    @Column(name = "product_name" , nullable = false)
    @JsonProperty("name")
    private String name;

    @NotBlank(message = "Style name is required")
    @Column(name = "style_name",nullable = false)
    private String styleName;

    @NotBlank(message = "Colour is required")
    @Column(nullable = false)
    private String colour;

    @Column(length = 1000)
    private String description;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;

    private String supplier;

    @NotBlank(message = "Size is required")
    @Column(nullable = false)
    private String size;

    @Column(name = "created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
