<script setup lang="ts">
import UploadProgress from '@/components/layout/UploadProgress.vue';
import { updated } from '@/requests/handleFile';
import { ref } from 'vue';

const uploadInfo = ref('')
const start = ref(false)
const percentage = ref(0)

async function text() {
    start.value = true
    //await updated(uploadInfo, percentage)
    start.value = false

}

function add() {
    percentage.value += 10
}

</script>

<template>
    <button type="button" @click="text">关于</button>

    <UploadProgress v-if="start" :percentage="percentage" @cancel="add">
        {{ uploadInfo }}
    </UploadProgress>

    <el-button type="danger" style="width: 100px;" @click="add()" plain>取消上传</el-button>
</template>

<style scoped>
</style>
