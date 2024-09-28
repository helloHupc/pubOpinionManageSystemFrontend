import request from "@/utils/request";
import {
  DataManagePageQuery,
  DataManagePageVO,
  DataManageUpdateSentiVO,
} from "./model";

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

  static updateBlogSenti(updateSentiParam?: DataManageUpdateSentiVO) {
    return request<any, any>({
      url: `/blog_info/update_senti`,
      method: "post",
      data: updateSentiParam,
    });
  }
}

export default DataManageApi;
