<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  data: { name: string; value: number }[]
  title?: string
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
      text: props.title || '2025年每月增长额',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.map(d => d.name),
      axisLine: { lineStyle: { color: '#999' } },
      axisLabel: { color: '#333' }
    },
    yAxis: {
      type: 'value',
      name: '增长额',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        name: '增长额',
        type: 'line',
        smooth: true,
        data: props.data.map(d => d.value),
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#409EFF',
          width: 3
        },
        itemStyle: {
          color: '#67C23A',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: 'rgba(64,158,255,0.15)'
        }
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

watch(
  () => props.data,
  () => renderChart(),
  { deep: true }
)
</script>

<template>
  <div ref="chartRef" class="chart-box"></div>
</template>

<style scoped>
.chart-box {
  width: 100%;
  height: 400px;
}
</style>
