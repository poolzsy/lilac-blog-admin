<template>
  <el-container class="layout-container-pro">
    <!-- 左侧侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '210px'" class="sidebar-container">
      <!-- Logo 区域 -->
      <div class="logo-area" @click="goHome">
        <el-icon :size="32" class="logo-icon">
          <ElemeFilled />
        </el-icon>
        <!-- 仅在展开时显示标题 -->
        <h1 v-if="!isCollapse" class="logo-title">博客后台</h1>
      </div>

      <!-- 导航菜单 -->
      <el-menu 
        :default-active="activeMenu" 
        class="el-menu-vertical-pro" 
        :collapse="isCollapse"
        background-color="#2d3a4b" 
        text-color="rgba(255, 255, 255, 0.7)" 
        active-text-color="#409EFF" 
        router
        :collapse-transition="false"
      >
        <!-- 【核心修改】菜单项现在由 permissionStore 动态生成 -->
        <SidebarItem v-for="route in menuRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部 Header -->
      <el-header class="header-container">
        <div class="header-left">
          <!-- 折叠按钮 -->
          <el-icon class="collapse-btn" @click="toggleSidebar">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <!-- 面包屑导航 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path" :to="{ path: item.path }">
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <!-- 用户头像及下拉菜单 -->
          <el-dropdown @command="handleCommand">
            <span class="avatar-dropdown">
              <!-- 可以替换为真实的用户头像 -->
              <el-avatar :icon="UserFilled" :size="36" />
              <span class="username">{{ userStore.userInfo.nickName || userStore.userInfo.username || '用户' }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="home">项目首页</el-dropdown-item>
                <el-dropdown-item command="github" divided>项目地址</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区域 -->
      <el-main class="main-container">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { usePermissionStore } from '@/stores/permission';
import { UserFilled, ArrowDown, ElemeFilled, Fold, Expand } from '@element-plus/icons-vue';
import SidebarItem from './SidebarItem.vue';

// --- 核心 Store 和 Router 实例 ---
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const permissionStore = usePermissionStore();

// --- 侧边栏状态 ---
const isCollapse = ref(false);
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
};

// 从 Pinia 的 permissionStore 中获取完整的、合并了静态和动态的路由作为菜单数据
const menuRoutes = computed(() => permissionStore.routes.filter(r => !r.hidden));

// 当前激活的菜单项，与路由路径同步
const activeMenu = computed(() => {
    const { meta, path } = route;
    // 如果路由元信息中指定了 activeMenu，则使用它，否则使用路由路径
    if (meta.activeMenu) {
        return meta.activeMenu;
    }
    return path;
});

// 面包屑数据
const breadcrumbItems = computed(() => {
    // 过滤出有 title 的路由层级
    return route.matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
});


// --- 事件处理 ---
const goHome = () => {
  router.push('/');
}

// 下拉菜单命令处理
const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      userStore.logout();
      break;
    case 'home':
      router.push('/dashboard');
      break;
    case 'github':
      window.open('https://github.com/lilac-blog-admin', '_blank');
      break;
    default:
      break;
  }
};
</script>

<style scoped>
@import '@/assets/css/Layout.css'; 
</style>
