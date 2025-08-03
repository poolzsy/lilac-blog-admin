<template>
  <div class="dashboard-container">
    <div class="welcome-box">
      <span class="welcome-text">博客管理系统</span>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.welcome-box {
  padding: 40px 80px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}
.welcome-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.welcome-text {
  font-size: 42px;
  font-weight: 600;
  color: #333;
}
</style>
