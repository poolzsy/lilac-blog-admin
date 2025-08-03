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
    /* 动画效果，让内容优雅地入场 */
    animation: fadeInUp 1s ease-in-out;
}

/* 巨大的 404 数字，作为背景装饰 */
.error-code {
    font-size: 220px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.25); /* 半透明，不抢戏 */
    position: absolute;
    top: 50%;
    left: 50%;
    /* 关键：使其居中并置于内容底层 */
    transform: translate(-50%, -50%);
    z-index: -1;
    user-select: none; /* 防止用户选中 */
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
