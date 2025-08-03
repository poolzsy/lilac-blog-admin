<template>
  <div v-if="!item.hidden">
    <!-- 只有一个子节点，且子节点没有自己的孩子，则直接显示为一级菜单 -->
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
      <el-menu-item :index="resolvePath(onlyOneChild.path)">
        <el-icon><component :is="onlyOneChild.meta.icon || item.meta.icon" /></el-icon>
        <template #title>{{ onlyOneChild.meta.title }}</template>
      </el-menu-item>
    </template>

    <!-- 存在多个子节点，渲染为子菜单 -->
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import path from 'path-browserify';

const props = defineProps({
  item: { type: Object, required: true },
  basePath: { type: String, default: '' }
});

const onlyOneChild = ref(null);

function hasOneShowingChild(children = [], parent) {
  const showingChildren = children.filter(item => !item.hidden);
  if (showingChildren.length === 1) {
    onlyOneChild.value = showingChildren[0];
    return true;
  }
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
    return true;
  }
  return false;
}

function resolvePath(routePath) {
  return path.resolve(props.basePath, routePath);
}
</script>

<style>
/* 确保 Element Plus 图标能正常被 component :is 渲染 */
@import url("//at.alicdn.com/t/c/font_2410206_1vg4f1pstvd.css");
.el-icon {
  width: 1em;
  height: 1em;
}
</style>
