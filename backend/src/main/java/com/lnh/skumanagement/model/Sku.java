package com.lnh.skumanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Sku {

    private Long id;

    private String skuCode;

    private String name;

    private String styleName;

    private String colour;

    private String description;

    private Integer quantity;

    private Double price;

    private String category;
    
    private String supplier;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
