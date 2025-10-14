<script setup lang="ts">

import { checkPasswordStrength } from '@/utils/inspectionTool';
import { reactive, ref, watch } from 'vue';
import 'element-plus/dist/index.css'
import { password_form_rules } from '@/utils/validateRules';
import { createLoading, openErrorNotice, openSuccessNotice } from '@/utils/noticeUtils';
import { handleUpdateUserPassword } from '@/requests/handleUser';

const emits = defineEmits<{
    (e: 'update:close'): void
}>()

const form = reactive<{
    oldPassword: string
    newPassword: string
    confirmPassword: string
}>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const rules = password_form_rules(form)
const strength = ref(0)
watch(() => form.newPassword, () => {
    strength.value = checkPasswordStrength(form.newPassword)
}), { deep: true }

const formRef = ref()
async function submitForm() {
    const loadingInstance = createLoading('修改中...')
    formRef.value.validate().then(async (valid: boolean) => {
        if (valid) {
            const result = await handleUpdateUserPassword(form.oldPassword, form.newPassword)
        }
    }).catch((error: Error) => {
        console.log('表单验证失败', error);
        openErrorNotice('请检查表单输入')
    }).finally(() => {
        loadingInstance.close()
    })
}

function resetForm() {
    form.confirmPassword = ''
    form.newPassword = ''
    form.oldPassword = ''
}

function back() {
    emits('update:close')
}
</script>

<template>
    <Teleport to="body">
        <div class="overlay">
            <div class="update-box">
                <el-page-header @back="back" content="修改密码">
                </el-page-header>
                <el-form :model="form" status-icon label-position="left" :rules="rules" ref="formRef"
                    label-width="100px" class="update-form">
                    <el-form-item label="原密码" prop="oldPassword">
                        <el-input type="password" v-model="form.oldPassword" autocomplete="off"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input type="password" v-model="form.newPassword" autocomplete="off"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input type="password" v-model="form.confirmPassword" autocomplete="off"
                            show-password></el-input>
                    </el-form-item>

                    <el-form-item class="form-buttons">
                        <el-button type="primary" @click="submitForm()">提交</el-button>
                        <el-button @click="resetForm()">重置</el-button>
                    </el-form-item>

                </el-form>
                <el-progress :percentage="strength * 20" :format="() => '当前密码强度: ' + strength + '/5'" :stroke-width="20"
                    :text-inside="true" style="width: 80%; margin-top: 20px;">
                </el-progress>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    /* 半透明黑背景 */
    backdrop-filter: blur(2px);
    /* 背景虚化 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9900;
}

.update-box {
    width: 480px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    z-index: 9995;
    position: relative;
    /* 添加相对定位 */

    display: flex;
    /* 开启 flex 布局 */
    justify-content: center;
    /* 水平居中 */
    flex-direction: column;
    /* 垂直方向上正常排列子元素 */
    align-items: center;
    /* 可选：垂直方向居中 */
    padding: 20px;
    /* 内边距美观 */
    box-sizing: border-box;
}

.update-box .el-page-header {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
}


.update-form {
    width: 80%;
    /* 最大宽度 400px，避免太宽 */
    margin: 20px auto;
    /* 水平居中 */
}

.form-buttons :deep(.el-form-item__content) {
    display: flex;
    justify-content: center;
    margin-left: 0 !important;
}

.form-buttons .el-button {
    margin: 0 16px;
}
</style>
