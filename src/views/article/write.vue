<template>
  <!-- 根容器负责提供内边距和白色背景 -->
  <div class="page-container">
    <el-form ref="formRef" :model="postForm" :rules="formRules" label-width="100px">
      <!-- 上半部分的表单布局 -->
      <el-row :gutter="20">
        <!-- 左侧表单项 -->
        <el-col :span="16">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="postForm.title" placeholder="请输入文章标题" />
          </el-form-item>
          <el-form-item label="文章摘要" prop="summary">
            <el-input v-model="postForm.summary" type="textarea" :rows="3" placeholder="请输入文章摘要" />
          </el-form-item>
          <el-form-item label="缩略图" prop="thumbnail_url">
            <el-upload
              class="thumbnail-uploader" drag
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
            >
              <img v-if="postForm.thumbnail_url" :src="postForm.thumbnail_url" class="thumbnail" />
              <div v-else class="uploader-icon-area">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </div>
              <template #tip>
                <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
        <!-- 右侧表单项 -->
        <el-col :span="8">
          <el-form-item label="分类" prop="category_id">
            <el-select v-model="postForm.category_id" placeholder="请选择分类" style="width: 100%;"><el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select>
          </el-form-item>
          <el-form-item label="标签" prop="tags">
            <el-select v-model="postForm.tags" multiple filterable placeholder="请选择标签" style="width: 100%;"><el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select>
          </el-form-item>
          <el-form-item label="允许评论" prop="allow_comment">
             <el-radio-group v-model="postForm.allow_comment"><el-radio :label="true">正常</el-radio><el-radio :label="false">停用</el-radio></el-radio-group>
          </el-form-item>
          <el-form-item label="是否置顶" prop="is_top">
             <el-radio-group v-model="postForm.is_top"><el-radio :label="true">是</el-radio><el-radio :label="false">否</el-radio></el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePublish">发布</el-button>
            <el-button @click="handleSaveDraft">保存到草稿箱</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- Markdown 编辑器 -->
      <div class="markdown-editor-wrapper">
        <Editor :value="postForm.content" :plugins="plugins" :locale="zhHans" @change="(v) => (postForm.content = v)" placeholder="开始创作..." />
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
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
const plugins = [ gfm(), highlight() ];

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
.bytemd-dropdown-body {
  background-color: #fff;
  border: 1px solid #e6e6e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 3000 !important; /* 确保层级最高 */
}
</style>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #fff;
  min-height: 100%;
  box-sizing: border-box;
}
.thumbnail-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.thumbnail-uploader .el-upload:hover { border-color: var(--el-color-primary); }
.uploader-icon-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 178px;
  height: 178px;
  color: #8c939d;
}
.el-icon--upload { font-size: 50px; margin-bottom: 10px; }
.thumbnail { width: 178px; height: 178px; display: block; object-fit: cover; }
.markdown-editor-wrapper {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.markdown-editor-wrapper :deep(.bytemd) {
  height: calc(100vh - 425px); /* 根据页面表单高度微调 */
  min-height: 400px;
}
</style>
