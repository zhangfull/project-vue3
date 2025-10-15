<script setup lang="ts">
import { handleGetUserInfo } from '@/requests/handleUser';
import type { UserInfoResponseData } from '@/types';
import { onMounted, ref } from 'vue';
import { useLoginStore } from '@/stores/loginStore';
import ShowMyInfo from '@/components/sub-layouts/ShowMyInfo.vue';
import EditMyInfo from '@/components/sub-layouts/EditMyInfo.vue';
import { openErrorNotice } from '@/utils/noticeUtils';
const loginStore = useLoginStore()

const personalInfo = ref<UserInfoResponseData | null>(null);
const showMyInfo = ref(true);
function turnShowAndEdit() {
    showMyInfo.value = !showMyInfo.value;
}
onMounted(async () => {
    handleGetUserInfo().then((res) => {
        personalInfo.value = res
        if (!personalInfo.value) {
            throw new Error('个人信息为空')
        }
        loginStore.avatarUrl = personalInfo.value.avatarUrl
        loginStore.refreshAvatarBase64();
        console.log('个人信息界面加载完成')
    }).catch((err) => {
        console.log('个人信息界面加载失败')
        openErrorNotice('个人信息加载失败，请刷新页面')
    })

});
</script>

<template>
    <ShowMyInfo v-if="showMyInfo" :personalInfo="personalInfo" @update:turn="turnShowAndEdit" />
    <EditMyInfo v-else :personalInfo="personalInfo" @update:turn="turnShowAndEdit" />
</template>

<style scoped></style>