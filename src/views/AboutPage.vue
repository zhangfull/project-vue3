<script setup lang="ts">
import UploadProgress from '@/components/dialog/UploadProgress.vue';

import { ref } from 'vue';

const uploadInfo = ref('')
const start = ref(false)
const percentage = ref(0)


function add() {
    percentage.value += 10
}


</script>

<template>
    <button type="button" @click="start = !start">测试</button>

    <UploadProgress v-if="start" :percentage="percentage" @cancel="add">
        {{ uploadInfo }}
    </UploadProgress>
    <a href="api/file/download" download>下载文件</a>

</template>

<style scoped></style>
