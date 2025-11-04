<script setup lang="ts">
import BarChart from '@/components/comment/BarChart.vue';
import LineChart from '@/components/comment/LineChart.vue';
import PieChart from '@/components/comment/PieChart.vue'
import type { ChartData, UploaderListItem } from '@/types';
import { onMounted, ref } from 'vue';
import { getHistory } from '../requests/homeAcquisition';

const data = ref<ChartData[]>([])


// 生成30天的随机数据
for (let i = 1; i <= 30; i++) {
    data.value.push({
        name: `${i}日`,
        value: Math.floor(Math.random() * 100) + 1 // 生成1-100的随机数
    })
}

const monthlyData = ref([
    { name: '1月', value: 120 },
    { name: '2月', value: 180 },
    { name: '3月', value: 220 },
    { name: '4月', value: 260 },
    { name: '5月', value: 310 },
    { name: '6月', value: 400 },
    { name: '7月', value: 370 },
    { name: '8月', value: 450 },
    { name: '9月', value: 480 },
    { name: '10月', value: 530 },
    { name: '11月', value: 580 },
    { name: '12月', value: 620 },
])

const hospitalTypeData = ref([
    { name: '2月', value: 180 },
    { name: '3月', value: 220 },
    { name: '4月', value: 260 },
    { name: '5月', value: 310 },
    { name: '6月', value: 400 },
    { name: '7月', value: 370 },
])

const uploaderList = ref<UploaderListItem[]>([])

function goto(value: UploaderListItem) {
    console.log(value);

}

onMounted(async () => {
    const [uploaderList0] = await Promise.all([getHistory()])
    uploaderList.value = uploaderList0
    console.log(uploaderList.value);

})

</script>

<template>
    <div class="row">
        <div class="two_lines">
            <div class="small_box">
                <PieChart title="医院类型分布" :data="hospitalTypeData" :colors="['#3498db', '#2ecc71', '#e74c3c']" />
            </div>
            <div class="small_box">
                <BarChart title="销量统计" :data="data" />
            </div>


        </div>
        <div class="one_line">
            <div class="big_box">
                <h3 style="text-align: center; color: gray; margin-top: 20px;">上传记录（近100条）</h3>
                <el-table :data="uploaderList" height="700" style="width: 90%; margin: 0 auto; cursor: pointer;"
                    @row-click="goto">
                    <el-table-column prop="date" label="时间" min-width="30%">
                    </el-table-column>
                    <el-table-column prop="text" label="记录" min-width="70%">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>

</template>

<style scoped>
.row {
    display: flex;
    justify-content: space-around;
    /* 左右两块更靠近 */
    align-items: center;
    /* 垂直居中对齐 */
    padding: 20px;
}

.two_lines {
    display: flex;
    flex-direction: column;
    /* 左边上下排列 */
    justify-content: center;
    width: calc(50% - 20px);
    gap: 20px;
    /* 左边两个box之间的间距 */
}

.one_line {
    width: calc(50% - 20px);
    white-space: nowrap;
    /* 防止右边换行 */
}

.small_box {
    width: 100%;
    height: 400px;
    background-color: #fff;
    border-radius: 12px;
    /* 圆角 */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    /* 悬浮阴影效果 */
    border: 1px solid #e0e0e0;
    /* 边框 */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.big_box {
    width: 100%;
    height: 820px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;

    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    color: #333;
}
</style>
