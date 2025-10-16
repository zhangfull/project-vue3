<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    percentage: number
}>()

const emits = defineEmits<{
    (e: 'cancel'): void,
    (e: 'success'): void
}>()

const percentageString = ref('0')
watch(() => props.percentage, () => {
    getColorByPercentage(props.percentage)    
    percentageString.value = props.percentage.toFixed(0)
}), {
    deep: true
}

function getColorByPercentage(percentage: number) {
    const colors = [
        '#bbdefb', // 0-9%    浅蓝（起步阶段）
        '#90caf9', // 10-19%  天蓝（开始进展）
        '#81c784', // 20-29%  淡绿（稳步前进）
        '#66bb6a', // 30-39%  亮绿（健康状态）
        '#d4e157', // 40-49%  青黄（中期）
        '#ffeb3b', // 50-59%  明黄（警示轻微）
        '#ffb300', // 60-69%  橙黄（注意状态）
        '#fb8c00', // 70-79%  橙色（临近目标）
        '#f4511e', // 80-89%  橙红（高强度或高风险）
        '#d32f2f'  // 90-100% 鲜红（终点或高负载完成）
    ];
    const index = Math.min(Math.floor(percentage / 10), 9);
    return colors[index];
}

</script>

<template>
    <div class="notice-container">
        <section class="notice-content">
            <div class="header">
                <h2 class="title">
                    文件上传中
                </h2>
                <div class="percentage">{{ percentageString }}%</div>
            </div>

            <div class="slot-content">
                <slot />
            </div>

            <div class="progress-section">
                <el-progress :percentage="props.percentage" :color="getColorByPercentage" :stroke-width="8"
                    :show-text="false"></el-progress>
            </div>

            <div v-if="percentage < 100" class="actions">
                <el-button type="danger" @click="emits('cancel')" plain class="cancel-btn">
                    取消上传
                </el-button>
            </div>
            <div v-else class="actions">
                <el-button type="success" @click="emits('success')" plain class="cancel-btn">
                    上传成功
                </el-button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.notice-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 9999;
}

.notice-content {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    min-width: 400px;
    max-width: 500px;
    animation: slideIn 0.3s ease-out;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    display: flex;
    align-items: center;
    gap: 8px;
}

.title i {
    color: #409eff;
}

.percentage {
    font-size: 24px;
    font-weight: 700;
    color: #409eff;
}

.slot-content {
    text-align: center;
    margin-bottom: 20px;
    min-height: 20px;
}

.progress-section {
    margin-bottom: 24px;
}

.progress-text {
    text-align: center;
    margin-top: 8px;
    font-size: 14px;
    color: #606266;
}

.actions {
    display: flex;
    justify-content: center;
}

.cancel-btn {
    width: 120px;
}

.cancel-btn i {
    margin-right: 4px;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* 响应式设计 */
@media (max-width: 480px) {
    .notice-content {
        min-width: 300px;
        margin: 20px;
        padding: 20px;
    }

    .header {
        flex-direction: column;
        gap: 12px;
        text-align: center;
    }

    .percentage {
        font-size: 20px;
    }
}
</style>
