<script setup lang="ts">
import type { DetailFile } from '@/types';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'
import { parseText } from '@/utils/textParseCustomTags';
import { handleGetDetail } from '@/requests/handleFile';

const route = useRoute()
let id = Number(route.params.id)
// 返回列表
function goBack() {
    window.close()
}

const text = '#子标题# 在同一行\n里包含 @红色词@。'

const fileDetail = ref<DetailFile | null>(null);
onMounted(async () => {
    fileDetail.value = await handleGetDetail(id)
})
</script>
<template>
    <main>
        <el-page-header class="el-page-header" @back="goBack" content="返回列表">
        </el-page-header>
        <section class="page-body">
            <div class="detail-container">
                <h1>{{ id }}</h1>
            </div>
        </section>
        <section v-html="parseText(text)"></section>
    </main>
</template>

<style scoped>
.el-page-header {
    position: absolute;
    top: 20px;
    left: 60px;
    z-index: 10;
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 64px;
    /* 调大图标大小，比如 64px */
    color: #56615c;
    /* 可选：改颜色 */
}

.page-body {
    position: absolute;
    top: 100px;
    width: 100%;
}

.detail-container {
    display: flex;
    /* 使用 Flex 布局，让子元素可以用 flex 属性对齐 */
    flex-direction: column;
    /* 子元素垂直排列（上下排列） */
    justify-content: center;
    /* 垂直方向（列方向）居中 */
    align-items: center;
    /* 水平方向居中子元素 */
    text-align: center;
    /* 子元素里的文本居中对齐 */
    margin: 0 auto;
    /* 如果是块元素，可以水平居中容器本身 */
    max-width: 600px;
    /* 容器最大宽度 600px，超过不再拉宽 */
    padding: 20px;
    /* 内边距，给内容留空白 */
}
</style>
