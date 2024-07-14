import request from "@/utils/request";
import { CaptchaResult, LoginData, LoginResult } from "./model";

class AuthAPI {
  /**
   * 登录API
   *
   * @param data {LoginData}
   * @returns
   */
  static login(data: LoginData) {
    console.log("LoginData", data);
    return request<any, LoginResult>({
      url: "/login",
      method: "post",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 注销API
   */
  static logout() {
    return request({
      url: "/api/v1/auth/logout",
      method: "delete",
    });
  }

  /**
   * 获取验证码
   */
  static getCaptcha() {
    return request<any, CaptchaResult>({
      url: "/captcha",
      method: "get",
    });
  }
}

export default AuthAPI;
