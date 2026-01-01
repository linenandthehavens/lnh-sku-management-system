package com.lnh.skumanagement.repository.mapper;

import com.lnh.skumanagement.repository.entity.SkuEntity;
import com.lnh.skumanagement.config.CommonMappingConfiguration;
import com.lnh.skumanagement.model.Sku;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(config = CommonMappingConfiguration.class)
public interface SkuEntityMapper {
    SkuEntity toSkuEntity(Sku sku);
    Sku toSku(SkuEntity skuEntity);

    List<SkuEntity> toSkuEntityList(List<Sku> skuList);
    List<Sku> toSkuList(List<SkuEntity> skuEntities);
}
