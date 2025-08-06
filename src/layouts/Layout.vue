<template>
  <el-container class="layout-container-pro">
    <!-- 左侧侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '210px'" class="sidebar-container">
      <!-- Logo 区域 -->
      <div class="logo-area" @click="goHome">
        <el-icon :size="32" class="logo-icon">
          <ElemeFilled />
        </el-icon>
        <h1 v-if="!isCollapse" class="logo-title">博客后台</h1>
      </div>
      <el-menu :default-active="activeMenu" class="el-menu-vertical-pro" :collapse="isCollapse"
        background-color="#2d3a4b" text-color="rgba(255, 255, 255, 0.7)" active-text-color="#409EFF"
        :collapse-transition="false" @select="handleMenuSelect">
        <SidebarItem v-for="route in menuRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-aside>

    <el-container>
      <!-- ... 顶部 Header 部分 ... -->
      <el-header class="header-container">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleSidebar">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <!-- 面包屑的 key 绑定 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="item.path + index"
              :to="{ path: item.path }">
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="avatar-dropdown">
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
        <router-view v-if="isRouterAlive" v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
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

// --- 页面刷新逻辑 ---
const isRouterAlive = ref(true);
const reloadPage = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};

// --- 菜单选择处理函数 ---
const handleMenuSelect = (path) => {
  // el-menu 的 select 事件回调参数是菜单项的 index (即 path)
  if (route.path === path) {
    // 如果点击的是当前页面，则执行刷新操作
    reloadPage();
  } else {
    // 如果是不同页面，则正常跳转
    router.push(path);
  }
};

const isCollapse = ref(false);
const toggleSidebar = () => { isCollapse.value = !isCollapse.value; };

const menuRoutes = computed(() => permissionStore.routes.filter(r => !r.hidden));

const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});

// 面包屑数据源
const breadcrumbItems = computed(() => {
  return route.matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
});

const goHome = () => {
  router.push('/');
}

// 下拉菜单命令处理
const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      userStore.logout();
      router.push('/login');
      break;
    case 'home':
      router.push('/dashboard');
      break;
    case 'github':
      window.open('https://github.com/lilac-blog-admin', '_blank');
      break;
  }
};
</script>

<style scoped>
/* 您的样式保持不变 */
@import '@/assets/css/Layout.css';

/* 确保动画效果 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
