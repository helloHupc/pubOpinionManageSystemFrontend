import request from "@/utils/request";
import {
  DynamicDatasetPageQuery,
  DynamicDatasetPageVO,
  DynamicDatasetIdsVO,
} from "./model";

class DynamicDatasetApi {
  static getDynamicDatasetList(queryParams?: DynamicDatasetPageQuery) {
    return request<any, PageResult<DynamicDatasetPageVO[]>>({
      url: `/blog_info/get_dynamic_dataset_list`,
      method: "post",
      data: queryParams,
    });
  }

  static exportDynamicDataset(exportDynamicDatasetParam?: DynamicDatasetIdsVO) {
    return request({
      url: `/blog_info/export_dynamic_dataset_csv`,
      method: "post",
      data: exportDynamicDatasetParam,
      responseType: "blob", // 指定响应类型为 blob
    }).then((response) => {
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "download.csv"; // 默认文件名
      console.log("contentDisposition", contentDisposition);

      if (contentDisposition && contentDisposition.includes("filename=")) {
        try {
          fileName = decodeURI(contentDisposition.split(";")[1].split("=")[1]);
        } catch (error) {
          console.error("Error parsing file name:", error);
        }
      }

      const blob = new Blob([response.data], { type: "text/csv" });
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}

export default DynamicDatasetApi;
