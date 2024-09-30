export interface DynamicDatasetPageQuery extends PageQuery {
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
}

export interface DynamicDatasetPageVO {
  /** 关键词ID */
  id?: number;
  /** 创建时间 */
  createTime?: Date;
  /** 修改时间 */
  updateTime?: Date;
}
