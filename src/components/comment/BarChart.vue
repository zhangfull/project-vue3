<script setup lang="ts">
import type { ChartData } from '@/types';
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
    data: ChartData[],
    title?: string;
}>()

const barRef = ref<HTMLDivElement | null>(null)
let barChart: echarts.ECharts | null = null

onMounted(() => {
    if (barRef.value) {

        barChart = echarts.init(barRef.value!)

        barChart.setOption({
            title: { text: props.title || '柱状图', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: props.data.map(d => d.name) },
            yAxis: { type: 'value' },
            dataZoom: [
                { type: 'slider', show: true, start: 0, end: 30 },
                { type: 'inside' }
            ],
            series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: props.data.map(d => d.value),
                    itemStyle: { color: '#409EFF' }
                }
            ]
        })

        window.addEventListener('resize', resizeCharts)
    }
})

function resizeCharts() {
    barChart?.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  barChart?.dispose()
})
</script>

<template>
    <div ref="barRef" class="chart-box"></div>
</template>

<style scoped>
.chart-box {
  width: 100%;
  height: 400px;
}
</style>
