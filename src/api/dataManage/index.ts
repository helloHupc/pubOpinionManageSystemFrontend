import request from "@/utils/request";
import { DataManagePageQuery, DataManagePageVO } from "./model";

class DataManageApi {
  static crawlBlogData(roleId?: number) {
    return request<any, PageResult<DataManagePageVO[]>>({
      url: `/crawler/crawl_data_by_key_word`,
      method: "post",
      data: {
        keywords: roleId,
      },
    });
  }

  static getBlogList(queryParams?: DataManagePageQuery) {
    return request<any, PageResult<DataManagePageVO[]>>({
      url: `/crawler/get_blog_list`,
      method: "post",
      data: queryParams,
    });
  }
}

export default DataManageApi;
