<script setup lang="ts">
import UploadProgress from '@/components/dialog/UploadProgress.vue';
import { updated } from '@/requests/handleFile';
import { test } from '@/requests/handleLogin';
import { ref } from 'vue';

const uploadInfo = ref('')
const start = ref(false)
const percentage = ref(0)

async function text() {
    test()
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

<style scoped></style>
