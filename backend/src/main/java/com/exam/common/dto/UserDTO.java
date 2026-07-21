package com.exam.common.dto;

import org.apache.ibatis.type.Alias;
import java.io.Serializable;

@Alias("UserDTO")
public class UserDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    String userId;
    String pwd;
    String userNm;
    String userEmail;
    String userStatus;
    Long roleId;

    public UserDTO() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPwd() { return pwd; }
    public void setPwd(String pwd) { this.pwd = pwd; }

    public String getUserNm() { return userNm; }
    public void setUserNm(String userNm) { this.userNm = userNm; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserStatus() { return userStatus; }
    public void setUserStatus(String userStatus) { this.userStatus = userStatus; }

    public Long getRoleId() { return roleId; }
    public void setRoleId(Long roleId) { this.roleId = roleId; }

    @Override
    public String toString() {
        return "UserDTO{userId='" + userId + "', userNm='" + userNm + "'}";
    }
}
