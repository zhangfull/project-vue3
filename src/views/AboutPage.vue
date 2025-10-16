<script setup lang="ts">
import UploadProgress from '@/components/dialog/UploadProgress.vue';
import { parseText } from '@/utils/textParseCustomTags';
import { ref } from 'vue';

const uploadInfo = ref('')
const start = ref(false)
const percentage = ref(0)


function add() {
    percentage.value += 10
}

function sub() {
    console.log( String(text.value));
    
}
const text = ref('')
</script>

<template>
    <button type="button" @click="start = !start">测试</button>

    <UploadProgress v-if="start" :percentage="percentage" @cancel="add">
        {{ uploadInfo }}
    </UploadProgress>
    <a href="api/file/download" download>下载文件</a>

    <el-input type="textarea" v-model="text" :rows="6"
        placeholder="换行请使用'\n'符号；设置小标题请使用'#小标题#'格式；设置突出显示请使用'@突出显示内容@'格式">
    </el-input>
    <section class="preview-en">
        <div v-html="parseText(text)"></div>
    </section>

    <button type="button" @click="sub">提交</button>

</template>

<style scoped></style>
