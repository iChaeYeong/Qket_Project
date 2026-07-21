package com.exam.common.service;

import com.exam.common.dto.UserDTO;
import com.exam.common.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDTO login(String userId, String pwd) {
        UserDTO user = userMapper.findById(userId);
        if (user == null) return null;
        if (!passwordEncoder.matches(pwd, user.getPwd())) return null;
        user.setPwd(null);
        return user;
    }

    @Override
    @Transactional
    public int register(UserDTO userDTO) {
        userDTO.setPwd(passwordEncoder.encode(userDTO.getPwd()));
        return userMapper.save(userDTO);
    }
}
