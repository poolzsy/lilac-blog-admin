<template>
  <div class="dashboard-welcome-container">
    <el-card shadow="hover" class="welcome-card">
      <el-icon class="background-icon">
        <EditPen />
      </el-icon>
      <div class="card-content">
        <h1 class="welcome-title">欢迎使用 博客管理系统</h1>
        <p class="welcome-subtitle">在这里，记录思想，分享生活。开启您的创作之旅吧！</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { EditPen } from '@element-plus/icons-vue';
</script>

<style scoped>
.dashboard-welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #f7f8fc;
  background-image:
    radial-gradient(circle at 100% 100%, #dbeafe 0%, transparent 40%),
    radial-gradient(circle at 0% 100%, #e0e7ff 0%, transparent 40%),
    radial-gradient(circle at 0% 0%, #ede9fe 0%, transparent 30%);
}

.welcome-card {
  width: 60%;
  max-width: 800px;
  min-height: 250px;
  padding: 30px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: none;
  transition: all 0.3s ease;

  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(63, 71, 186, 0.1);
}

.welcome-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.15);
}

.background-icon {
  position: absolute;
  right: -30px;
  bottom: -40px;
  font-size: 200px;
  color: rgba(99, 102, 241, 0.1);
  z-index: 1;
  transform: rotate(-15deg);
}

.card-content {
  position: relative;
  z-index: 2;
  text-align: left;
}

.welcome-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  line-height: 1.3;
}

.welcome-subtitle {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
}
</style>
