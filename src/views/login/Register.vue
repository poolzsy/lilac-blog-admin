<template>
    <div class="register-container">
        <div class="register-box">
            <div class="register-form-wrapper">
                <div class="title">创建您的新账户</div>
                <el-form ref="formRef" :model="data.form" :rules="rules">
                    <el-form-item prop="username">
                        <el-input size="large" v-model="data.form.username" placeholder="请输入您的账号" :prefix-icon="User" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input size="large" v-model="data.form.password" type="password" placeholder="请输入密码"
                            :prefix-icon="Lock" show-password />
                    </el-form-item>
                    <el-form-item prop="confirmPassword">
                        <el-input size="large" v-model="data.form.confirmPassword" type="password" placeholder="请再次输入密码"
                            :prefix-icon="Lock" show-password />
                    </el-form-item>
                    <el-form-item>
                        <el-button class="register-button" type="primary" size="large" @click="handleRegister">
                            立 即 注 册
                        </el-button>
                    </el-form-item>
                </el-form>
                <div class="login-link">
                    <span>已有账号？</span>
                    <el-link type="primary" href="/login">前往登录</el-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';

// 拿到 Form 的 DOM 引用，用于后续的校验操作
const formRef = ref(null);

// 表单响应式数据
const data = reactive({
    form: {
        username: '',
        password: '',
        confirmPassword: ''
    }
});

// 自定义校验函数：验证“确认密码”
const validateConfirmPassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== data.form.password) {
        callback(new Error("两次输入的密码不一致!"));
    } else {
        callback();
    }
};

// 表单校验规则
const rules = reactive({
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, message: '账号长度不能少于3位', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    confirmPassword: [
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
});

// 注册处理函数
const handleRegister = () => {
    formRef.value.validate(valid => {
        if (valid) {
            console.log('校验通过，准备提交注册信息:', data.form);
            // 此处应调用注册 API
        } else {
            console.log('表单校验失败');
            return false;
        }
    });
};
</script>

<style scoped>
@import url('@/assets/css/Register.css');
</style>
