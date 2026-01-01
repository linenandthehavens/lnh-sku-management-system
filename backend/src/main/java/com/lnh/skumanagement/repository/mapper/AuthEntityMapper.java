package com.lnh.skumanagement.repository.mapper;

import com.lnh.skumanagement.config.CommonMappingConfiguration;
import com.lnh.skumanagement.model.LoginRequest;
import com.lnh.skumanagement.repository.entity.LoginEntity;
import org.mapstruct.Mapper;

@Mapper(config = CommonMappingConfiguration.class)
public interface AuthEntityMapper {

    LoginEntity toLoginEntity(LoginRequest loginRequest);
}
