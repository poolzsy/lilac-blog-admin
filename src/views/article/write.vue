<template>
  <!-- 页面根容器 -->
  <div class="editor-page-container">
    <el-form ref="formRef" :model="postForm" :rules="formRules" class="editor-form">
      <!-- 采用两栏布局 -->
      <el-row :gutter="24">

        <el-col :span="18">
          <div class="main-content-col">
            <!-- 文章标题 -->
            <el-form-item prop="title">
              <el-input v-model="postForm.title" placeholder="请输入文章标题" size="large" class="title-input" />
            </el-form-item>

            <!-- Markdown 编辑器 -->
            <div class="editor-container">
              <Editor :value="postForm.content" :plugins="plugins" :locale="zhHans"
                @change="(v) => (postForm.content = v)" placeholder="开始创作..." />
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="settings-col">
            <el-card shadow="never" class="settings-card">
              <template #header>
                <div class="card-header">
                  <span>发布设置</span>
                </div>
              </template>

              <el-form label-position="top">
                <el-form-item label="分类" prop="category_id">
                  <el-select v-model="postForm.category_id" placeholder="请选择分类" style="width: 100%;"><el-option
                      v-for="item in categoryOptions" :key="item.value" :label="item.label"
                      :value="item.value" /></el-select>
                </el-form-item>

                <el-form-item label="标签" prop="tags">
                  <el-select v-model="postForm.tags" multiple filterable placeholder="请选择或创建标签"
                    style="width: 100%;"><el-option v-for="item in tagOptions" :key="item.value" :label="item.label"
                      :value="item.value" /></el-select>
                </el-form-item>

                <el-form-item label="文章摘要" prop="summary">
                  <el-input v-model="postForm.summary" type="textarea" :rows="3" placeholder="可选，若不填则自动截取正文前100字" />
                </el-form-item>

                <el-form-item label="缩略图" prop="thumbnail_url">
                  <el-upload class="thumbnail-uploader-compact"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :show-file-list="false"
                    :on-success="handleUploadSuccess" :before-upload="beforeUpload">
                    <img v-if="postForm.thumbnail_url" :src="postForm.thumbnail_url" class="thumbnail" />
                    <el-icon v-else class="uploader-icon">
                      <Plus />
                    </el-icon>
                  </el-upload>
                </el-form-item>

                <el-divider />

                <el-form-item label="允许评论" prop="allow_comment">
                  <el-switch v-model="postForm.allow_comment" active-text="允许" inactive-text="禁止" inline-prompt />
                </el-form-item>

                <el-form-item label="是否置顶" prop="is_top">
                  <el-switch v-model="postForm.is_top" active-text="是" inactive-text="否" inline-prompt />
                </el-form-item>

                <el-divider />

                <div class="actions">
                  <el-button @click="handleSaveDraft">保存草稿</el-button>
                  <el-button type="primary" @click="handlePublish">立即发布</el-button>
                </div>
              </el-form>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { Editor } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import zhHans from 'bytemd/locales/zh_Hans.json';
import 'bytemd/dist/index.css';

const formRef = ref(null);
const postForm = reactive({ title: '', summary: '', thumbnail_url: '', category_id: null, tags: [], allow_comment: true, is_top: false, content: '' });
const formRules = reactive({
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  category_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
});

const categoryOptions = ref([{ value: 1, label: '技术分享' }, { value: 2, label: '产品思考' }, { value: 3, label: '生活杂谈' }]);
const tagOptions = ref([{ value: 'Vue', label: 'Vue' }, { value: 'React', label: 'React' }, { value: 'Node.js', label: 'Node.js' }]);
const plugins = [gfm(), highlight()];

const handleUploadSuccess = (res, file) => {
  postForm.thumbnail_url = URL.createObjectURL(file.raw);
  ElMessage.success('缩略图上传成功!');
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) ElMessage.error('只能上传 JPG/PNG 格式的图片!');
  const isLt500k = file.size / 1024 < 500;
  if (!isLt500k) ElMessage.error('图片大小不能超过 500KB!');
  return isJpgOrPng && isLt500k;
};
const handlePublish = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (!postForm.content) return ElMessage.warning('文章内容不能为空！');
      console.log('校验通过，发布文章:', JSON.parse(JSON.stringify(postForm)));
      ElMessage.success('发布成功!');
    } else {
      ElMessage.error('请检查表单必填项！');
    }
  });
};
const handleSaveDraft = () => {
  console.log('保存草稿:', JSON.parse(JSON.stringify(postForm)));
  ElMessage.info('已保存到草稿箱。');
};
</script>


<style>
/* 全局修正 bytemd 弹窗的 z-index 和背景 */
.bytemd-dropdown-body {
  background-color: #fff;
  border: 1px solid #e6e6e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 3000 !important;
}
</style>

<style scoped>
.editor-page-container {
  /* 使用 Flexbox 来更好地控制高度 */
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
  /* 100vh - 顶部导航栏高度 -
  自身padding */
  padding: 24px;
  background-color: #f5f7fa;
  /* 使用淡灰色背景，突出白色卡片和编辑器 */
}

.editor-form {
  display: contents;
}

.editor-form .el-row {
  flex-grow: 1;
  /* 让行填满剩余空间 */
}

/* 左侧主内容列 */
.main-content-col {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);

}

.title-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  /* 移除标题输入框的边框，使其融入背景 */
  font-size: 24px;
  padding: 20px;
}

.editor-container {
  flex-grow: 1;
  /* 让编辑器容器占据所有剩余空间 */
  border-top: 1px solid var(--el-border-color-light);
}

.editor-container :deep(.bytemd) {
  height: 100%;
  /* 让编辑器填满其容器 */
}

/* 右侧设置面板 */
.settings-card {
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
}

.settings-card :deep(.el-card__header) {
  padding: 14px 20px;
  font-weight: 500;
  background-color: #fafcfe;
}

.settings-card :deep(.el-form-item) {
  margin-bottom: 18px;
}

/* 紧凑型缩略图上传器 */
.thumbnail-uploader-compact .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.thumbnail-uploader-compact .el-upload:hover {
  border-color: var(--el-color-primary);
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.thumbnail {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>