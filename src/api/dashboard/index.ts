import request from "@/utils/request";
import {
  LogPageQuery,
  LogPageVO,
  VisitStatsVO,
  VisitTrendQuery,
  VisitTrendVO,
} from "./model";

class DashboardAPI {
  /**
   * 首页卡片信息
   * @returns
   */
  static getCardInfo() {
    return request<any, any>({
      url: `/dashboard/get_card_info`,
      method: "post",
      data: {},
    });
  }

  /**
   * 获取最近7天微博数量
   * @returns
   */
  static getRecentBlogNum() {
    return request<any, any>({
      url: `/dashboard/get_recent_blog_num`,
      method: "post",
      data: {},
    });
  }

  /**
   * 以关键词分组获取微博数量
   * @returns
   */
  static getBlogNumGroupByKeyword() {
    return request<any, any>({
      url: `/dashboard/get_blog_num_group_by_keyword`,
      method: "post",
      data: {},
    });
  }
}

export default DashboardAPI;
