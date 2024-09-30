export interface DataManagePageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: number | null;
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
}

export interface DataManagePageVO {
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

export interface DataManageUpdateSentiVO {
  /** 数据ID */
  id?: number;
  /** 更新情感 */
  senti?: string;
}

export interface DataManageIdsVO {
  /** 数据ID */
  ids?: string;
}
