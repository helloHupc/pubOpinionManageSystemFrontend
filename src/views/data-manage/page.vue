<!-- 分类字典 -->
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键词" prop="name">
          <el-select
            v-model="queryParams.keywords"
            placeholder="请选择关键词"
            clearable
            @change="handleQuery"
            class="keyword-select"
          >
            <el-option
              v-for="keyword in keywordOptions"
              :key="keyword.value"
              :label="keyword.label"
              :value="keyword.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="抓取时间">
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
          type="success"
          :disabled="ids.length === 0"
          @click="insertDynamicDataset()"
        >
          <i-ep-plus />
          加入动态数据集
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

        <el-table-column label="关键词" width="150" prop="key_word" />
        <el-table-column label="微博ID" width="150" prop="blog_id" />
        <el-table-column label="微博发布人" width="250" prop="author_name" />
        <el-table-column
          label="微博内容"
          width="650"
          prop="blog_content"
          header-align="center"
        />
        <el-table-column label="情感" width="100">
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
        <el-table-column label="微博地址" width="200">
          <template #default="scope">
            <el-button type="primary" size="small"
              ><a :href="scope.row.blog_url" target="_blank"
                >点击查看微博</a
              ></el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="点赞数" width="100" prop="like_count" />
        <el-table-column label="发布时间" prop="publish_time" />
        <el-table-column label="抓取时间" prop="createTime" />
        <el-table-column
          fixed="right"
          label="操作"
          width="220"
          header-align="center"
        >
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleEditClick(scope.row.id, scope.blog_sentiment)"
            >
              <i-ep-edit />
              修改情感
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="insertDynamicDataset(scope.row.id)"
              :style="{
                display: scope.row.is_add_dynamic_dataset == 1 ? 'none' : '',
              }"
            >
              <i-ep-MagicStick />
              加入动态数据集
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 修改情感弹框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px">
      <el-form @submit.native.prevent="submitEdit">
        <el-form-item label="正确情感">
          <el-select
            style="width: 200px"
            v-model="selectedSentiment"
            placeholder="请选择情感"
          >
            <el-option
              v-for="option in sentimentOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Dict",
  inherititems: false,
});

import {
  DataManagePageQuery,
  DataManagePageVO,
  DataManageIdsVO,
} from "@/api/dataManage/model";
import KeyWordAPI from "@/api/keyWord";
import DataManageAPI from "@/api/dataManage";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<DataManagePageQuery>({
  pageNum: 1,
  pageSize: 10,
  keywords: null, // 初始化关键字
});

const insertDynamicDatasetParam = reactive<DataManageIdsVO>({
  ids: "",
});

const tableData = ref<DataManagePageVO[]>();

// 字典弹窗
const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<DictForm>({});

// 关键词下拉数据
const keywordOptions = ref<OptionType[]>([]); // 增加关键字选项数组

const computedRules = computed(() => {
  const rules: Partial<Record<string, any>> = {
    name: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
    code: [{ required: true, message: "请输入字典编码", trigger: "blur" }],
  };
  if (formData.dictItems) {
    formData.dictItems.forEach((attr, index) => {
      rules[`dictItems.${index}.name`] = [
        { required: true, message: "请输入字典项名称", trigger: "blur" },
      ];
    });
  }
  return rules;
});

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

/** 加入动态数据集 */
function insertDynamicDataset(dataId?: number) {
  const dataIds = [dataId || ids.value].join(",");
  if (!dataIds) {
    ElMessage.warning("请勾选数据项");
    return;
  }
  insertDynamicDatasetParam.ids = dataIds;
  console.log("insertDynamicDatasetParam", insertDynamicDatasetParam);

  ElMessageBox.confirm("确认将已选中的数据项加入动态数据集?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      DataManageAPI.insertDynamicDataset(insertDynamicDatasetParam)
        .then(() => {
          ElMessage.success("加入成功");
          handleQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消操作");
    }
  );
}

// 查询
function handleQuery() {
  loading.value = true;
  DataManageAPI.getBlogList(queryParams)
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

function fetchKeywordOptions() {
  KeyWordAPI.getKeywordList()
    .then((data) => {
      keywordOptions.value = data;
    })
    .finally(() => {});
}

// 行选择
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

function checkSelectable(row: any) {
  return row.is_add_dynamic_dataset === 0;
}

// 当前选中的情感
const selectedSentiment = ref<string>("");

// 当前选中的微博ID
const selectedId = ref<number | null>(null);

// 情感选项
const sentimentOptions = [
  { label: "正面", value: "positive" },
  { label: "负面", value: "negative" },
];

/**
 * 修改情感
 *
 * @param id 数据ID
 * @param string 微博情感
 */
function handleEditClick(id: number, blog_sentiment: string) {
  dialog.visible = true;
  dialog.title = "情感修改";
  console.log("dialog", dialog);
  selectedSentiment.value = blog_sentiment; // 初始化下拉框选择
  selectedId.value = id; // 保存数据ID
}

// 提交编辑结果
function submitEdit() {
  // 假设此处调用接口更新情感数据
  console.log("提交的情感为：", selectedSentiment.value);
  console.log("提交的数据ID为：", selectedId.value);
  if (selectedId.value === null || !selectedSentiment.value) {
    ElMessage.error("请完整填写信息！");
    return;
  }

  const updateSentiParam = {
    /** 数据ID */
    id: selectedId.value,
    /** 更新情感 */
    senti: selectedSentiment.value,
  };

  DataManageAPI.updateBlogSenti(updateSentiParam)
    .then((data) => {
      console.log("updateBlogSenti data", data);
      ElMessage.success("情感修改成功！");
      dialog.visible = false; // 关闭弹框
      handleQuery();
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 关闭字典弹窗 */
function handleCloseDialog() {
  dialog.visible = false;

  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();

  formData.id = undefined;
}

onMounted(() => {
  handleQuery();
  fetchKeywordOptions(); // 获取关键字选项
});
</script>

<style scoped lang="scss">
.el-form--inline .el-form-item {
  margin-top: 18px;
}
.keyword-select {
  width: 300px; /* 你可以调整这个宽度 */
}
</style>
