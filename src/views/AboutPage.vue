<script setup lang="ts">
import BarChart from '@/components/comment/BarChart.vue';
import type { ChartData } from '@/types';
import { ref } from 'vue';

const data = ref<ChartData[]>([])

// 生成30天的随机数据
for (let i = 1; i <= 30; i++) {
    data.value.push({
        name: `${i}日`,
        value: Math.floor(Math.random() * 100) + 1 // 生成1-100的随机数
    })
}

</script>

<template>
    <BarChart :data="data"/>
</template>

<style scoped>
</style>
