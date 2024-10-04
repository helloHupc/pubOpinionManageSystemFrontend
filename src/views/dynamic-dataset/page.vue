<!-- 动态数据集 -->
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
        :style="{ height: '45px' }"
      >
        <el-form-item label="添加时间">
          <el-date-picker
            class="!w-[240px]"
            v-model="dateTimeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"
            ><i-ep-search />搜索</el-button
          >
          <el-button @click="handleResetClick()"
            ><i-ep-refresh />重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <template #header>
        <el-button
          type="primary"
          :disabled="ids.length === 0"
          @click="exportDynamicDataset()"
        >
          <i-ep-plus />
          导出
        </el-button>
      </template>
      <el-table
        v-loading="loading"
        highlight-current-row
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :selectable="checkSelectable"
          width="55"
          align="center"
        />

        <el-table-column label="微博ID" width="200" prop="blog_id" />
        <el-table-column label="微博内容" width="550" prop="blog_content" />
        <el-table-column label="情感" width="150">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.blog_sentiment === 'positive' ? 'success' : 'danger'
              "
            >
              {{ scope.row.blog_sentiment === "positive" ? "正面" : "负面" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="加入时间" prop="createTime" width="250" />
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dict",
  inherititems: false,
});

import {
  DynamicDatasetPageQuery,
  DynamicDatasetPageVO,
  DynamicDatasetIdsVO,
} from "@/api/dynamicDataset/model";
import DynamicDatasetAPI from "@/api/dynamicDataset";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<DynamicDatasetPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

const exportDynamicDatasetParam = reactive<DynamicDatasetIdsVO>({
  ids: "",
});

const tableData = ref<DynamicDatasetPageVO[]>();

const dateTimeRange = ref("");
watch(dateTimeRange, (newVal) => {
  if (newVal) {
    queryParams.startTime = newVal[0];
    queryParams.endTime = newVal[1];
  } else {
    queryParams.startTime = undefined;
    queryParams.endTime = undefined;
  }
});

// 查询
function handleQuery() {
  loading.value = true;
  DynamicDatasetAPI.getDynamicDatasetList(queryParams)
    .then((data) => {
      tableData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 重置查询
function handleResetClick() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

// 行选择
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

function checkSelectable(row: any) {
  return row.is_use === 0;
}

function exportDynamicDataset(dataId?: number) {
  const dataIds = [dataId || ids.value].join(",");
  if (!dataIds) {
    ElMessage.warning("请勾选数据项");
    return;
  }
  exportDynamicDatasetParam.ids = dataIds;
  console.log("exportDynamicDatasetParam", exportDynamicDatasetParam);

  DynamicDatasetAPI.exportDynamicDataset(exportDynamicDatasetParam);
}

// 当前选中的情感
const selectedSentiment = ref<string>("");

// 当前选中的微博ID
const selectedId = ref<number | null>(null);

onMounted(() => {
  handleQuery();
});
</script>

<style scoped lang="scss">
.keyword-select {
  width: 150px; /* 你可以调整这个宽度 */
}
</style>
