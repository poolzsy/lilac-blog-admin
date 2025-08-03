<template>
  <el-container class="layout-container">
    <!-- 左侧菜单栏 -->
    <el-aside width="210px" class="sidebar-container">
      <div class="logo-area">
        <img src="@/assets/logo.svg" alt="logo" class="logo-img" /> 
        <!-- 假设您有一个logo.svg -->
        <h1 v-if="!isCollapse" class="logo-title">博客后台</h1>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        background-color="#2d3a4b"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <!-- 动态渲染菜单 -->
        <SidebarItem v-for="route in menuRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header-container">
        <div class="header-left">
           <!--  面包屑导航 -->
           <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path" :to="{ path: item.path }">
                {{ item.meta.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="avatar-dropdown">
              <el-avatar :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
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
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowDown } from '@element-plus/icons-vue';
import SidebarItem from './SidebarItem.vue';

const router = useRouter();
const route = useRoute();

// 在真实项目中，这部分数据应该是通过 API 请求得到的
const mockMenuData = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        meta: { title: '首页', icon: 'HomeFilled' }
    },
    {
        path: '/editor',
        name: 'Editor',
        meta: { title: '写博文', icon: 'Edit' }
    },
    {
        path: '/system',
        name: 'System',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
            { path: 'user', name: 'UserManagement', meta: { title: '用户管理' } },
            { path: 'role', name: 'RoleManagement', meta: { title: '角色管理' } }
        ]
    },
    {
        path: '/content',
        name: 'Content',
        meta: { title: '内容管理', icon: 'Grid' },
        children: [
           { path: 'article', name: 'ArticleList', meta: { title: '文章列表' } },
           { path: 'category', name: 'Category', meta: { title: '分类管理' } }
        ]
    }
];
const menuRoutes = ref(mockMenuData);

const isCollapse = ref(false); // 控制菜单折叠

// 当前激活的菜单
const activeMenu = computed(() => route.path);

// 面包屑数据
const breadcrumbItems = computed(() => {
    return route.matched.filter(item => item.meta && item.meta.title);
});

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    console.log('User logout');
    router.push('/login');
  } else if (command === 'home') {
    router.push('/');
  }
};
</script>

<style scoped>
.layout-container { height: 100vh; }
.sidebar-container { background-color: #2d3a4b; transition: width 0.28s; }
.logo-area { display: flex; align-items: center; justify-content: center; height: 60px; background-color: #262f3e; }
.logo-img { width: 32px; height: 32px; margin-right: 12px; }
.logo-title { color: #fff; font-size: 18px; font-weight: 600; margin: 0; }
.el-menu { border-right: none; }
.header-container { display: flex; justify-content: space-between; align-items: center; background: #fff; box-shadow: 0 1px 4px rgba(0,21,41,.08); }
.avatar-dropdown { cursor: pointer; display: flex; align-items: center; }
.main-container { background-color: #f0f2f5; padding: 20px; }
</style>
