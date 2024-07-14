import request from "@/utils/request";
import { UserInfo } from "./model";

class UserAPI {
  /**
   * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
   */
  static getInfo(userId: string) {
    return request<any, UserInfo>({
      url: `user/${userId}`,
      method: "get",
    });
  }
}

export default UserAPI;
