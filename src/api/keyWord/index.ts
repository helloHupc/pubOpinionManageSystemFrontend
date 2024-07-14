import request from "@/utils/request";
import { KeyWordForm, KeyWordPageQuery, KeyWordPageVO } from "./model";

class KeyWordAPI {
  static add_key_word(data: KeyWordForm) {
    return request<any, any>({
      url: `/key_word/add`,
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static update_key_word(data: KeyWordForm) {
    return request<any, any>({
      url: `/key_word/update`,
      method: "post",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static getPage(queryParams?: KeyWordPageQuery) {
    return request<any, PageResult<KeyWordPageVO[]>>({
      url: `/key_word/get_list`,
      method: "post",
      data: queryParams,
    });
  }

  static getInfo(id: number) {
    return request<any, KeyWordForm>({
      url: `/key_word/get_info`,
      method: "post",
      data: { id: id },
    });
  }

  static deleteByIds(ids: number[]) {
    return request<any, any>({
      url: `/key_word/delete`,
      method: "post",
      data: { ids: ids },
    });
  }

  static getKeywordList() {
    return request<any, any>({
      url: `/key_word/get_key_word_list`,
      method: "post",
      data: {},
    });
  }
}

export default KeyWordAPI;
