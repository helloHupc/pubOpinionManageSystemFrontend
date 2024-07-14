/** 关键词表单对象 */
export interface KeyWordForm {
  /** 关键词ID */
  id?: number;
  /** 关键词名称 */
  key_word: string;
  /** 关键词描述 */
  description: string;
  /** 关键词状态(1-正常；0-停用) */
  status?: number;
}

export interface KeyWordPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
}

export interface KeyWordPageVO {
  /** 关键词ID */
  id?: number;
  /** 关键词名称 */
  key_word?: string;
  /** 关键词描述 */
  description?: string;
  /** 关键词创建人 */
  nickname?: string;
  /** 关键词状态 */
  status?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 修改时间 */
  updateTime?: Date;
}
