package com.exam.common.mapper;

import com.exam.common.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    UserDTO findById(String userId);
    int save(UserDTO userDTO);
}
