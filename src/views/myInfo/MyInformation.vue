<script setup lang="ts">
import { handleGetUserInfo } from '@/requests/handleUser';
import type { UserInfoResponseData } from '@/types';
import { onMounted, ref } from 'vue';
import { useLoginStore } from '@/stores/loginStore';
import ShowMyInfo from '@/components/sub-layouts/ShowMyInfo.vue';
import EditMyInfo from '@/components/sub-layouts/EditMyInfo.vue';
const loginStore = useLoginStore()

const personalInfo = ref<UserInfoResponseData | null>(null);
const showMyInfo = ref(true);
function turnShowAndEdit() {
    showMyInfo.value = !showMyInfo.value;
}

onMounted(async () => {
    personalInfo.value = await handleGetUserInfo()
    if (!personalInfo.value) {
        return
    }
    loginStore.avatarUrl = personalInfo.value.avatarUrl
    loginStore.refreshAvatarBase64();
    console.log('个人信息界面加载完成')
});
</script>

<template>
    <ShowMyInfo v-if="showMyInfo" :personalInfo="personalInfo" @update:turn="turnShowAndEdit" />
    <EditMyInfo v-else :personalInfo="personalInfo" @update:turn="turnShowAndEdit" />
</template>

<style scoped></style>