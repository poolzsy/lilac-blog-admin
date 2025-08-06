<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-form-wrapper">
                <div class="title">欢迎登录博客管理系统</div>
                <el-form ref="formRef" :model="data.form" :rules="rules">
                    <el-form-item prop="username">
                        <el-input size="large" v-model="data.form.username" placeholder="请输入账号" :prefix-icon="User" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input size="large" v-model="data.form.password" type="password" placeholder="请输入密码"
                            :prefix-icon="Lock" show-password />
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login-button" type="primary" size="large" @click="login">
                            登 录
                        </el-button>
                    </el-form-item>
                </el-form>
                <div class="register-link">
                    <span>还没有账号？</span>
                    <el-link type="primary" href="/register">立即注册</el-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive,ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage, ElLink } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { usePermissionStore } from '@/stores/permission';
import request from '@/utils/request';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const permissionStore = usePermissionStore();
const loading = ref(false);

const formRef = ref();

const data = reactive({
    form: {
        username: '',
        password: ''
    }
});

const rules = {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const login = () => {
    formRef.value.validate(valid => {
        if (valid) {
            loading.value = true;
            userStore.login(data.form).then(() => {
                // 登录成功后，主动调用 permissionStore 的方法来生成路由
                return permissionStore.generateRoutes();
            }).then(accessRoutes => {
                // 将获取到的动态路由添加到 router 实例中
                accessRoutes.forEach(route => {
                    router.addRoute(route);
                });
                
                // 添加 404 页面，确保它在所有动态路由之后
                router.addRoute({ path: '/:catchAll(.*)', redirect: '/404', hidden: true });
 
                // 所有路由都准备好之后，再进行跳转
                ElMessage.success("登录成功");
                const redirect = route.query.redirect || '/';
                router.push(redirect);
 
            }).catch(error => {
                ElMessage.error(error.message || "登录或获取权限失败，请重试");
            }).finally(() => {
                loading.value = false;
            });
        } else {
            ElMessage.error('请填写账号和密码');
        }
    });
};
</script>

<style scoped>
@import url('@/assets/css/Login.css');
</style>
