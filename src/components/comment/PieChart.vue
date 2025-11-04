<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
    title?: string
    data: { name: string; value: number }[]
    colors?: string[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

onMounted(() => {
    if (chartRef.value) {
        chart = echarts.init(chartRef.value)
        renderChart()
        window.addEventListener('resize', resizeChart)
    }
})

function renderChart() {
    if (!chart) return
    chart.setOption({
        title: {
            text: props.title || '',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2c3e50'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle',
            textStyle: {
                color: '#34495e',
                fontSize: 13
            }
        },
        series: [
            {
                name: props.title || '数据',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    scale: true,
                    scaleSize: 10,
                    label: {
                        show: true,
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#2c3e50'
                    }
                },
                labelLine: {
                    show: false
                },
                data: props.data,
                color:
                    props.colors || ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6']
            }
        ]
    })
}

function resizeChart() {
    chart?.resize()
}

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart)
    chart?.dispose()
})

// 响应数据变化时自动更新
watch(
    () => props.data,
    () => renderChart(),
    { deep: true }
)
</script>

<template>
    <div ref="chartRef" class="pie-chart"></div>
</template>

<style scoped>
.pie-chart {
    width: 100%;
    height: 400px;
}
</style>
