import AuthAPI from "@/api/auth";
import UserAPI from "@/api/user";
import { resetRouter } from "@/router";
import { store } from "@/store";

import { LoginData } from "@/api/auth/model";
import { UserInfo } from "@/api/user/model";
import { TOKEN_KEY, USER_TOKEN_KEY } from "@/enums/CacheEnum";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserInfo>({
    roles: [],
    perms: [],
  });

  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(loginData)
        .then((data) => {
          console.log("res data", data);
          const { accessToken, userToken } = data;
          if (accessToken && userToken) {
            localStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.setItem(USER_TOKEN_KEY, userToken);
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      // 从 localStorage 中获取 userId
      const userId = localStorage.getItem(USER_TOKEN_KEY);

      if (!userId) {
        reject("User ID is not found.");
        return;
      }
      UserAPI.getInfo(userId)
        .then((data) => {
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          if (!data.roles || data.roles.length <= 0) {
            reject("getUserInfo: roles must be a non-null array!");
            return;
          }
          Object.assign(user.value, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      localStorage.setItem(TOKEN_KEY, "");
      localStorage.setItem(USER_TOKEN_KEY, "");
      location.reload(); // 清空路由
      resolve();
    });
  }

  // remove token
  function resetToken() {
    console.log("resetToken");
    return new Promise<void>((resolve) => {
      localStorage.setItem(TOKEN_KEY, "");
      resetRouter();
      resolve();
    });
  }

  return {
    user,
    login,
    getUserInfo,
    logout,
    resetToken,
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
