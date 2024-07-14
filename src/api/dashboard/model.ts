/**
 * 日志分页查询对象
 */
export interface LogPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
}

/**
 * 系统日志分页VO
 */
export interface LogPageVO {
  /** 主键 */
  id: number;
  /** 日志模块 */
  module: string;
  /** 日志内容 */
  content: string;
  /** 请求路径 */
  requestUri: string;
  /** 请求方法 */
  method: string;
  /** IP 地址 */
  ip: string;
  /** 地区 */
  region: string;
  /** 浏览器 */
  browser: string;
  /** 终端系统 */
  os: string;
  /** 执行时间(毫秒) */
  executionTime: number;
  /** 操作人 */
  operator: string;
}

/**  访问趋势视图对象 */
export interface VisitTrendVO {
  /** 日期列表 */
  dates: string[];
  /** 浏览量(PV) */
  pvList: number[];
  /** 访客数(UV) */
  uvList: number[];
  /** IP数 */
  ipList: number[];
}

/** 访问趋势查询参数 */
export interface VisitTrendQuery {
  /** 开始日期 */
  startDate: string;
  /** 结束日期 */
  endDate: string;
}

/**  数量统计 */
export interface VisitStatsVO {
  /** 标题 */
  title: string;
  /** 类型 */
  type: "pv" | "uv" | "ip";

  /** 今日数量 */
  todayCount: number;
  /** 昨日数量 */
  yesterdayCount: number;
  /** 同比增长率（相对于昨天同一时间段的增长率） */
  growthRate: number;

  totalCountOutput: number;
}
