import request from "@/utils/request";
import { RouteVO } from "./model";

class MenuAPI {
  /**
   * 获取路由列表
   */
  static getRoutes() {
    return request<any, RouteVO[]>({
      url: "/menus/routes",
      method: "get",
    });
  }
}

export default MenuAPI;
