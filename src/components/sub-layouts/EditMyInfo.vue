<script setup lang="ts">

import { handleUpdateUserInfo } from '@/requests/handleUser';
import type { UploadUserRequestBody, UserInfoResponseData } from '@/types';
import { ref } from 'vue';
import { user_form_rules } from '@/utils/validateRules';
import { createLoading, openErrorNotice, openSuccessNotice } from '@/utils/noticeUtils';
import { ElLoading } from 'element-plus';

const props = defineProps<{
    personalInfo: UserInfoResponseData | null
}>()
const emits = defineEmits<{
    (e: 'update:turn'): void
}>()

const form = ref<UploadUserRequestBody>({
    name: props.personalInfo?.name || '',
    sex: props.personalInfo?.sex || '',
    briefIntroduction: props.personalInfo?.briefIntroduction || ''
})

function turn() {
    emits('update:turn')
}

const userFormRef = ref()
async function save() {
    if (form.value.name === props.personalInfo?.name && form.value.briefIntroduction === props.personalInfo.briefIntroduction && form.value.sex === props.personalInfo.sex) {
        openSuccessNotice('未做修改')
        emits('update:turn')
        return
    }
    const loadingInstance = createLoading('修改中...')
    userFormRef.value.validate().then(async (valid: boolean) => {
        if (valid) {
            // 验证通过，执行保存操作
            const result = await handleUpdateUserInfo(form.value)
            if (result) {
                console.log('验证通过，执行保存操作');
                props.personalInfo!.name = form.value.name
                props.personalInfo!.sex = form.value.sex
                props.personalInfo!.briefIntroduction = form.value.briefIntroduction
                emits('update:turn')
            } else {
                openErrorNotice("修改失败")
            }
        }
    }).catch((error: Error) => {
        console.log('表单验证失败');
        openErrorNotice('请检查表单输入')
    }).finally(() => {
        // Loading should be closed asynchronously
        loadingInstance.close()
    })

}
</script>

<template>
    <el-page-header class="back-header" @back="turn" content="修改个人信息">
    </el-page-header>
    <main>

        <header>
            <h1>修改信息</h1>
        </header>
        <el-form :model="form" label-position='right' :rules="user_form_rules" ref="userFormRef" label-width="80px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="form.sex">
                    <el-radio-button label="man">男</el-radio-button>
                    <el-radio-button label="women">女</el-radio-button>
                    <el-radio-button label="undefined">秘密</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="简介">
                <el-input type="textarea" v-model="form.briefIntroduction" :rows="20"></el-input>
            </el-form-item>

            <el-form-item class="form-buttons">
                <el-button type="primary" @click="save()">提交更改</el-button>
            </el-form-item>
        </el-form>
    </main>
</template>

<style scoped>
main {
    max-width: 80%;
    margin: 0 auto;
    padding: 2rem;
    align-items: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
}

.back-header {
    top: 60px;
    left: 10px;
    z-index: 10;
}

header {
    text-align: center;
    margin-bottom: 2rem;
}

header h1 {
    color: #2c3e50;
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
}

.form-buttons :deep(.el-form-item__content) {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 2rem;
    margin-left: 0 !important;
}
</style>
