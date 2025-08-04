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
import { useRouter } from 'vue-router';
import request from '@/utils/request';

const router = useRouter();
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
            request.post("/user/login", data.form).then(res => {
                if (res.code === 200) {
                    localStorage.setItem("token", res.data.token);
                    ElMessage.success("登录成功");
                    router.push("/");
                } else {
                    ElMessage.error(res.data.message || "登录失败，请重试");
                }
            }).catch(error => {
                ElMessage.error("网络错误，请稍后再试");
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
