package com.exam.reservation.mapper;

import com.exam.reservation.dto.AccountDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AccountMapper {
    List<AccountDTO> findByUserId(String userId);
    AccountDTO findByAccountNo(String accountNo);
    int updateBalance(AccountDTO accountDTO);
}
