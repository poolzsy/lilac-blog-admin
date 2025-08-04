<template>
  <el-container class="layout-container-pro">
    <el-aside :width="isCollapse ? '64px' : '210px'" class="sidebar-container">
      <div class="logo-area">
        <el-icon :size="32" class="logo-icon">
          <ElemeFilled />
        </el-icon>
        <h1 class="logo-title">博客后台</h1>
      </div>

      <el-menu :default-active="activeMenu" class="el-menu-vertical-pro" :collapse="isCollapse"
        background-color="#2d3a4b" text-color="rgba(255, 255, 255, 0.7)" active-text-color="#ffffff" router>
        <SidebarItem v-for="route in menuRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header-container">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleSidebar">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
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

      <el-main class="main-container" :class="{ 'no-padding': route.meta.noPadding }">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in" @after-leave="handleAfterLeave">
            <component v-if="isRouterAlive" :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserFilled, ArrowDown, ElemeFilled, Fold, Expand } from '@element-plus/icons-vue';
import SidebarItem from './SidebarItem.vue';
const router = useRouter();
const route = useRoute();
const isRouterAlive = ref(true);
watch(() => route.path, () => { isRouterAlive.value = false; });
const handleAfterLeave = () => { isRouterAlive.value = true; };
const isCollapse = ref(false);
const toggleSidebar = () => { isCollapse.value = !isCollapse.value; };
const mockMenuData = [{ path: '/dashboard', name: 'Dashboard', meta: { title: '首页', icon: 'HomeFilled', noPadding: true } }, { path: '/editor', name: 'Editor', meta: { title: '写博文', icon: 'Edit' } }, { path: '/system', name: 'System', meta: { title: '系统管理', icon: 'Setting' }, children: [{ path: '/system/user', name: 'UserManagement', meta: { title: '用户管理' } }, { path: '/system/role', name: 'RoleManagement', meta: { title: '角色管理' } }] }, { path: '/content', name: 'Content', meta: { title: '内容管理', icon: 'Grid' }, children: [{ path: '/content/article', name: 'ArticleList', meta: { title: '文章列表' } }, { path: '/content/category', name: 'Category', meta: { title: '分类管理' } }] }];
const menuRoutes = ref(mockMenuData);
const activeMenu = computed(() => route.path);
const breadcrumbItems = computed(() => route.matched.filter(item => item.meta && item.meta.title));
const handleCommand = (command) => { if (command === 'logout') { router.push('/login'); } else if (command === 'home') { router.push('/dashboard'); } };
</script>

<style scoped>
.layout-container-pro {
  height: 100vh;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 15px;
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  font-size: 22px;
  cursor: pointer;
  margin-right: 15px;
  color: #303133;
}

.avatar-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.avatar-dropdown .el-icon--right {
  margin-left: 8px;
}

.main-container {
  position: relative;
  overflow: hidden;
  transition: padding 0.28s;
}

.main-container.no-padding {
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from {
  transform: translateX(-20px);
}

.fade-leave-to {
  transform: translateX(20px);
}


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
  overflow: hidden;
}

.logo-icon {
  color: #409EFF;
  flex-shrink: 0;
}

.logo-title {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 0 12px;
  white-space: nowrap;

  transition: opacity 0.2s ease-out, margin-left 0.28s ease-out;
}

.el-menu-vertical-pro {
  border-right: none;
}

.el-menu--collapse {

  & .logo-title {
    opacity: 0;
    margin-left: 0;
  }

  & :deep(.el-sub-menu__title span),
  & :deep(.el-sub-menu__icon-arrow) {
    opacity: 0;
    width: 0;
  }
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 56px;
  line-height: 56px;
}

:deep(.el-menu-item) {
  &:hover:not(.is-active) {
    background-color: #263445 !important;
  }

  &.is-active {
    background-color: var(--el-color-primary) !important;
    color: #fff !important;
  }
}

:deep(.el-sub-menu .el-menu-item) {
  height: 50px;
  line-height: 50px;
  background-color: #1f2d3d !important;

  &:hover {
    background-color: #001528 !important;
  }

  &.is-active {
    background-color: var(--el-color-primary) !important;
  }
}
</style>
