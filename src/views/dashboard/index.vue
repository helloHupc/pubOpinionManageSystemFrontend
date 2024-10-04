<template>
  <div class="dashboard-container">
    <!-- 数据卡片 -->
    <el-row :gutter="10" class="mt-5">
      <el-col
        :xs="24"
        :sm="12"
        :lg="6"
        v-for="(item, index) in visitStatsList"
        :key="index"
      >
        <el-skeleton :loading="loading" :rows="5" animated>
          <template #template>
            <el-card>
              <div>
                <el-skeleton-item variant="h3" style="width: 40%" />
                <el-skeleton-item
                  variant="rect"
                  style="float: right; width: 1em; height: 1em"
                />
              </div>
              <div class="mt-10 flex-x-between">
                <el-skeleton-item variant="text" style="width: 30%" />
                <el-skeleton-item
                  variant="circle"
                  style="width: 2em; height: 2em"
                />
              </div>
              <div class="mt-5 flex-x-between">
                <el-skeleton-item variant="text" style="width: 50%" />
                <el-skeleton-item variant="text" style="width: 1em" />
              </div>
            </el-card>
          </template>
          <template v-if="!loading">
            <el-card shadow="never">
              <template #header>
                <div class="flex-x-between">
                  <span class="text-[var(--el-text-color-secondary)]">{{
                    item.title
                  }}</span>
                  <el-tag :type="item.tagType" size="small">
                    {{ item.granularity }}
                  </el-tag>
                </div>
              </template>

              <div class="flex-x-between mt-2">
                <div class="flex-y-center">
                  <span class="text-lg"> {{ item.todayCount }}</span>
                  <span
                    :class="[
                      'text-xs',
                      'ml-2',
                      getGrowthRateClass(item.growthRate),
                    ]"
                  >
                    <i-ep-top v-if="item.growthRate > 0" />
                    <i-ep-bottom v-else-if="item.growthRate < 0" />
                    {{ formatGrowthRate(item.growthRate) }}
                  </span>
                </div>
                <svg-icon :icon-class="item.icon" size="2em" />
              </div>

              <div
                class="flex-x-between mt-2 text-sm text-[var(--el-text-color-secondary)]"
              >
                <span>昨日{{ item.title }} </span>
                <span> {{ item.yesterdayCount }} </span>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </el-row>

    <!-- Echarts 图表 -->
    <el-row :gutter="10" class="mt-5">
      <el-col :xs="20" :span="16">
        <el-card>
          <div
            ref="weiboTotal"
            class="weiboNumberStat"
            width="100%"
            height="400px"
          ></div>
        </el-card>
      </el-col>
      <el-col :xs="12" :span="8">
        <el-card>
          <div
            ref="weiboSentiment"
            class="weiboSentiGroup"
            width="100%"
            height="400px"
          ></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

import { useTransition, TransitionPresets } from "@vueuse/core";
import DashboardAPI from "@/api/dashboard";
import { VisitStatsVO } from "@/api/dashboard/model";
import * as echarts from "echarts";

const loading = ref(true);
const visitStatsList = ref<VisitStats[] | null>(Array(3).fill({}));

interface VisitStats {
  title: string;
  icon: string;
  tagType: "primary" | "success" | "warning";
  growthRate: number;
  granularity: string;
  todayCount: number;
  yesterdayCount: number;
}

const loadVisitStatsData = async () => {
  const list: VisitStatsVO[] = await DashboardAPI.getCardInfo();

  if (list) {
    const tagTypes: ("primary" | "success" | "warning")[] = [
      "primary",
      "success",
      "warning",
    ];
    const transformedList: VisitStats[] = list.map((item, index) => ({
      title: item.title,
      icon: getVisitStatsIcon(item.type),
      tagType: tagTypes[index % tagTypes.length],
      growthRate: item.growthRate,
      granularity: "日",
      todayCount: item.todayCount,
      yesterdayCount: item.yesterdayCount,
    }));
    visitStatsList.value = transformedList;
    loading.value = false;
  }
};

/** 格式化增长率 */
const formatGrowthRate = (growthRate: number): string => {
  if (growthRate === 0) {
    return "-";
  }

  const formattedRate = Math.abs(growthRate)
    .toFixed(2)
    .replace(/\.?0+$/, "");
  return formattedRate + "%";
};

/** 获取增长率文本颜色类 */
const getGrowthRateClass = (growthRate: number): string => {
  if (growthRate > 0) {
    return "color-[--el-color-danger]";
  } else if (growthRate < 0) {
    return "color-[--el-color-success]";
  } else {
    return "color-[--el-color-info]";
  }
};

/** 获取访问统计图标 */
const getVisitStatsIcon = (type: string) => {
  return "monitor";
};

const renderLineChart = async () => {
  const lineChart = echarts.init(
    document.querySelector(".weiboNumberStat") as HTMLDivElement
  );
  const data_list = await DashboardAPI.getRecentBlogNum();
  console.log("data_list", data_list);
  const lineOption = {
    title: {
      text: "近7日抓取微博总数",
      left: "center",
      top: "1%",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    xAxis: {
      data: data_list.x_list,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: data_list.y_list,
        type: "line",
        smooth: true,
      },
    ],
  };
  lineChart.setOption(lineOption);
  window.addEventListener("resize", () => {
    lineChart.resize();
  });
};

const renderPieChart = async () => {
  const pieChart = echarts.init(
    document.querySelector(".weiboSentiGroup") as HTMLDivElement
  );
  const data_list = await DashboardAPI.getBlogNumGroupByKeyword();
  console.log("data_list", data_list);
  const pieOption = {
    title: {
      text: "关键词微博数量",
      left: "center",
      top: "1%",
    },
    tooltip: {
      show: true,
    },
    series: [
      {
        type: "pie",
        data: data_list,
      },
    ],
  };
  pieChart.setOption(pieOption);
  // 大小自适应
  window.addEventListener("resize", () => {
    pieChart.resize();
  });
};

onMounted(() => {
  loadVisitStatsData();
  renderLineChart();
  renderPieChart();
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  padding: 24px;

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    border: 0;
  }
  .weiboNumberStat,
  .weiboSentiGroup {
    width: 100%;
    height: 400px;
  }
}
</style>
