<script setup lang="ts">
import type { DetailFile } from '@/types';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { parseText } from '@/utils/textParseCustomTags';
import { handleGetDetail } from '@/requests/handleFile';
import { handleGetImg } from '@/requests/handleImg';
import '@/css/text.css';

const route = useRoute();
const id = Number(route.params.id);
const fileDetail = ref<DetailFile | null>(null);

const goBack = () => window.close();
const imgsBase64 = ref<string[]>([]);

onMounted(async () => {
  fileDetail.value = await handleGetDetail(id);
  if (fileDetail.value?.imgs?.length) {
    const promises = fileDetail.value.imgs
      .filter(Boolean)
      .map(img => handleGetImg(img!));
    imgsBase64.value = await Promise.all(promises);
  }
});

</script>
<template>
  <main>
    <el-page-header class="el-page-header" @back="goBack" content="返回列表" />

    <section class="page-body">
      <div class="detail-container">
        <h1>{{ fileDetail?.headline }}</h1>
        <dl>
          <dt>文件名</dt>
          <dd>{{ fileDetail?.fileName }}</dd>
          <dt>文件类型</dt>
          <dd>{{ fileDetail?.category }}</dd>
          <dt>收藏</dt>
          <dd>{{ fileDetail?.collectionCount }}</dd>
          <dt>大小</dt>
          <dd>{{ fileDetail?.size }}</dd>
          <dt>上传日期</dt>
          <dd>{{ fileDetail?.uploadDate }}</dd>
          <dt>上传者</dt>
          <dd>
            <a style="color: inherit;" :href="'#'">{{ fileDetail?.uploader }}</a>
          </dd>
         </dl>
      </div>
    </section>

    <section class="content-section" v-if="fileDetail?.introduce">
      <div v-html="parseText(fileDetail.introduce)" />
    </section>

    <section class="images-section" v-if="fileDetail?.imgs?.length">
      <el-image v-for="(value, index) in imgsBase64" :key="index" :src="value" class="content-image" />

    </section>
  </main>
</template>

<style scoped>
.el-page-header {
  position: absolute;
  top: 20px;
  left: 60px;
  z-index: 10;
}

.page-body {
  position: relative;
  width: 100%;
  padding-top: 100px;
  box-sizing: border-box;
}

.detail-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  max-width: 600px;
  padding: 20px;
  box-sizing: border-box;
}

.content-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.images-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.content-image {
  width: 100%;
  margin-bottom: 16px;
}
</style>
