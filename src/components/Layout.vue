<template>
  <el-container class="layout-container-pro">
    <!-- 左侧菜单栏 -->
    <el-aside width="210px" class="sidebar-container">
      <div class="logo-area">
        <el-icon :size="32" class="logo-icon"><ElemeFilled /></el-icon>
        <h1 v-if="!isCollapse" class="logo-title">博客后台</h1>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-pro"
        :collapse="isCollapse"
        background-color="#2d3a4b"
        text-color="rgba(255, 255, 255, 0.7)"
        active-text-color="#ffffff"
        router
      >
        <SidebarItem v-for="route in menuRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header-container">
        <div class="header-left">
           <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path" :to="{ path: item.path }">
                {{ item.meta.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="avatar-dropdown">
              <el-avatar :icon="UserFilled" :size="36" />
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="home">首页</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容区 -->
      <el-main class="main-container">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <!-- 
                !!!! 最核心的改动在这里 !!!!
                给 component 添加一个基于路由路径的 key。
                当路径变化时，key 变化，Vue会强制销毁并重建组件，从而确保页面刷新。
              -->
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
// Script 部分无需任何改动，保持原样即可
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserFilled, ArrowDown, ElemeFilled } from '@element-plus/icons-vue';
import SidebarItem from './SidebarItem.vue';

const router = useRouter();
const route = useRoute(); // useRoute() 提供了访问当前路由信息的对象，包括 path

const mockMenuData = [
    { path: '/dashboard', name: 'Dashboard', meta: { title: '首页', icon: 'HomeFilled' }},
    { path: '/editor', name: 'Editor', meta: { title: '写博文', icon: 'Edit' }},
    { path: '/system', name: 'System', meta: { title: '系统管理', icon: 'Setting' }, children: [
        { path: '/system/user', name: 'UserManagement', meta: { title: '用户管理' } },
        { path: '/system/role', name: 'RoleManagement', meta: { title: '角色管理' } }
    ]},
    { path: '/content', name: 'Content', meta: { title: '内容管理', icon: 'Grid' }, children: [
       { path: '/content/article', name: 'ArticleList', meta: { title: '文章列表' } },
       { path: '/content/category', name: 'Category', meta: { title: '分类管理' } }
    ]}
];
const menuRoutes = ref(mockMenuData);

const isCollapse = ref(false); 
const activeMenu = computed(() => route.path);
const breadcrumbItems = computed(() => route.matched.filter(item => item.meta && item.meta.title));

const handleCommand = (command) => {
  if (command === 'logout') {
    router.push('/login');
  } else if (command === 'home') {
    router.push('/dashboard'); // 建议使用 path 或 name
  }
};
</script>

<style scoped>
/* 样式部分无需任何改动，保持原样即可 */
.layout-container-pro { height: 100vh; }
.sidebar-container {
  background-color: #2d3a4b;
  transition: width 0.28s;
  border-right: none;
}
.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  padding: 0 10px;
}
.logo-icon { color: #409EFF; }
.logo-title {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 0 12px;
  white-space: nowrap;
}
.el-menu-vertical-pro { border-right: none; }
:deep(.el-menu-item), :deep(.el-sub-menu__title) { height: 56px; line-height: 56px; }
:deep(.el-menu-item) {
  &:hover:not(.is-active) { background-color: #263445 !important; }
  &.is-active { background-color: var(--el-color-primary) !important; color: #fff !important; }
}
:deep(.el-sub-menu .el-menu-item) {
    height: 50px; line-height: 50px; background-color: #1f2d3d !important;
    &:hover { background-color: #001528 !important; }
    &.is-active { background-color: var(--el-color-primary) !important; }
}
.header-container { display: flex; justify-content: space-between; align-items: center; background: #fff; border-bottom: 1px solid #e6e6e6; }
.avatar-dropdown { cursor: pointer; display: flex; align-items: center; }
.avatar-dropdown .el-icon--right { margin-left: 8px; }
.main-container { background-color: #f4f6f8; position: relative; padding: 0; }
.fade-transform-leave-active,
.fade-transform-enter-active { transition: all .5s; }
.fade-transform-enter-from { opacity: 0; transform: translateX(-30px); }
.fade-transform-leave-to { opacity: 0; transform: translateX(30px); }
</style>
