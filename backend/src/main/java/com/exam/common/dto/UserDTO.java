package com.exam.common.dto;

import org.apache.ibatis.type.Alias;

@Alias("UserDTO")
public class UserDTO {

    String userId;
    String pwd;
    String userNm;

    public UserDTO() {}

    public UserDTO(String userId, String pwd, String userNm) {
        this.userId = userId;
        this.pwd = pwd;
        this.userNm = userNm;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPwd() { return pwd; }
    public void setPwd(String pwd) { this.pwd = pwd; }

    public String getUserNm() { return userNm; }
    public void setUserNm(String userNm) { this.userNm = userNm; }

    @Override
    public String toString() {
        return "UserDTO{userId='" + userId + "', userNm='" + userNm + "'}";
    }
}
