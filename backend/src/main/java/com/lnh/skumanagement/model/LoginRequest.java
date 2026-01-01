package com.lnh.skumanagement.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Objects;

@JsonTypeName("LoginRequest")
@Data
public class LoginRequest {

    private String userName;

    private String password;

    private String passwordSalt;

    public LoginRequest userName(String userName) {
        this.userName = userName;
        return this;
    }

    /**
     * User ID, email, or phone number
     * @return loginId
     */

    @Schema(name = "userName", description = "User ID, email, or phone number", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("userName")
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LoginRequest password(String password) {
        this.password = password;
        return this;
    }

    /**
     * Get password
     * @return password
     */

    @Schema(name = "password", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("password")
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        LoginRequest loginRequest = (LoginRequest) o;
        return Objects.equals(this.userName, loginRequest.userName) &&
                Objects.equals(this.password, loginRequest.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userName, password);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class LoginRequestDto {\n");
        sb.append("    loginId: ").append(toIndentedString(userName)).append("\n");
        sb.append("    password: ").append(toIndentedString(password)).append("\n");
        sb.append("}");
        return sb.toString();
    }

    /**
     * Convert the given object to string with each line indented by 4 spaces
     * (except the first line).
     */
    private String toIndentedString(Object o) {
        if (o == null) {
            return "null";
        }
        return o.toString().replace("\n", "\n    ");
    }
}
