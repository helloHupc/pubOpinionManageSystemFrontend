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
      <el-table
        v-loading="loading"
        highlight-current-row
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="关键词" width="150" prop="key_word" />
        <el-table-column label="微博ID" width="150" prop="blog_id" />
        <el-table-column label="微博发布人" width="300" prop="author_name" />
        <el-table-column label="微博内容" width="650" prop="blog_content" />
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
        <el-table-column label="点赞数" width="150" prop="like_count" />
        <el-table-column label="发布时间" prop="publish_time" />
        <el-table-column label="抓取时间" prop="createTime" />
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

import { DataManagePageQuery, DataManagePageVO } from "@/api/dataManage/model";
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

// 新增字典
function handleAddClick() {
  dialog.visible = true;
  dialog.title = "新增字典";
}

/**
 * 编辑字典
 *
 * @param id 字典ID
 */
function handleEditClick(id: number, name: string) {
  dialog.visible = true;
  dialog.title = "【" + name + "】字典修改";
}

// 提交字典表单
function handleSubmitClick() {
  dataFormRef.value.validate((isValid: boolean) => {
    console.log("isValid", isValid);
    if (isValid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
      } else {
      }
    }
  });
}

/** 关闭字典弹窗 */
function handleCloseDialog() {
  dialog.visible = false;

  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();

  formData.id = undefined;
}
/**
 * 删除字典
 *
 * @param id 字典ID
 */
function handleDelete(id?: number) {
  const attrGroupIds = [id || ids.value].join(",");
  if (!attrGroupIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {},
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

// 新增字典
function handleAddAttrClick() {
  formData.dictItems = formData.dictItems ?? [];
  formData.dictItems.push({ sort: 1, status: 1 });
}
// 删除字典
function handleDeleteAttrClick(index: number) {
  if (formData.dictItems && formData.dictItems.length > 0) {
    formData.dictItems.splice(index, 1);
  }
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
