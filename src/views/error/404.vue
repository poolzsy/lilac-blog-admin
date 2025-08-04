<template>
    <div class="not-found-container">
        <div class="content-box">
            <div class="error-code">404</div>
            <div class="message">抱歉，您访问的页面不存在</div>
            <div class="sub-message">请检查您输入的网址是否正确，或点击下方按钮返回首页。</div>
            <el-button 
                class="home-button" 
                type="primary" 
                size="large" 
                round
                @click="goHome"
            >
                返回首页
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push('/');
};
</script>

<style scoped>
.not-found-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
    background-image: url("@/assets/imgs/404.jpg"); 
    background-size: cover;
    background-position: center;
    color: #fff;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.content-box {
    text-align: center;
    position: relative;
    padding: 20px;
    animation: fadeInUp 1s ease-in-out;
}

.error-code {
    font-size: 220px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.25);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    user-select: none; 
}

.message {
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 15px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.sub-message {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 40px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.home-button {
    font-size: 16px;
    letter-spacing: 1px;
    padding: 12px 30px;
    border: none;
    transition: transform 0.2s, box-shadow 0.2s;
}

.home-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(64, 158, 255, 0.5);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(60px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
