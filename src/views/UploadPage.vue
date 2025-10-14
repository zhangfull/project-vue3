<script setup lang="ts">
import type { Category, FileInfoForm } from '@/types';
import { onMounted, ref, watch } from 'vue';
import { file_form_rules } from '@/utils/validateRules';
import { ElMessage, type UploadFile } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'
import { handleGetFileCategories } from '@/requests/fileCategory';
import { updated } from '@/requests/handleFile';
import UploadProgress from '@/components/layout/UploadProgress.vue';


const form = ref<FileInfoForm>({
    headline: '',
    categoryCode: 1,
    fileName: '',
    size: '',
    description: '',
    introduce: '',
    display: false
})

const fileReady = ref(false)

const beforeUpload = (file: File) => {
    console.log('文件信息:', file.name, file.type)

    const allowedExtensions = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2']
    const fileName = file.name.toLowerCase()
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext))

    if (!isAllowed) {
        ElMessage.error('只能上传压缩文件（ZIP / RAR / 7Z / TAR / GZ / BZ2）')
        return false
    }

    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
        ElMessage.error('文件不能超过 500MB')
        return false
    }
    return true
}

const fileList = ref<File[]>([])

function handleChangeFile(_file: File, files: File[]) {

    if (files.length > 1) {
        files.splice(0, files.length - 1)
    }
    fileList.value = [...files]
    if (!files[0] || !beforeUpload(files[0])) {
        fileList.value.splice(0, fileList.value.length)
        files.splice(0, files.length)
        form.value.fileName = ''
        form.value.size = ''
        fileReady.value = false
        return
    }

    fileReady.value = true
    form.value.fileName = files[0].name
    form.value.size = (files[0].size / 1024 / 1024).toFixed(2) + 'MB'
}


interface ImgInfo {
    name: string
    url: string
    raw?: File
}

const imgs = ref<ImgInfo[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 图片选择后触发
function handleChangeImg(_uploadFile: UploadFile, uploadFiles: UploadFile[]) {
    // 只保留最近一次选择的一张或多张图片（根据需求可改）
    imgs.value = uploadFiles.map(file => {
        const url = file.url || (file.raw ? URL.createObjectURL(file.raw) : '')
        return { name: file.name, url, raw: file.raw }
    })
    console.log('当前 imgs 参数:', imgs.value)
}

// 点击预览触发
function handlePictureCardPreview(file: UploadFile) {
    const target = imgs.value.find(img => img.name === file.name)
    if (target) {
        dialogImageUrl.value = target.url
        dialogVisible.value = true
    } else {
        ElMessage.warning('未找到该图片')
    }
}

// 删除图片触发
function handleRemove(file: UploadFile, _fileList: UploadFile[]) {
    imgs.value = imgs.value.filter(img => img.name !== file.name)
    console.log('删除后 imgs 参数:', imgs.value)
}

const uploadRef = ref()
function resetForm() {
    form.value.headline = ''
    form.value.categoryCode = 1
    form.value.fileName = ''
    form.value.size = ''
    form.value.description = ''
    form.value.introduce = ''
    form.value.display = false
    uploadRef.value?.clearFiles()
    fileList.value.splice(0, fileList.value.length)
    fileReady.value = false
}

const uploadInfo = ref('')
const start = ref(false)
const percentage = ref(0)

async function submitForm() {
    //start.value = true
    const files = imgs.value.map(img => img.raw).filter(Boolean) as File[]
    updated(uploadInfo, percentage, fileList.value[0] || null, form.value, files.length > 0 ? files : null)
}

function cancel() {
    //cancel upload
    start.value = false
}

const fileCategory = ref<Category[]>([])
onMounted(async () => {
    fileCategory.value = await handleGetFileCategories();
    console.log('上传页面加载完成')
})
</script>

<template>
    <main>
        <header>
            <h1>上传文件</h1>
        </header>
        <section class="upload-file-container">
            <el-upload ref="uploadRef" drag action="#" multiple :auto-upload="false" :on-change="handleChangeFile"
                :on-remove="handleChangeFile" accept=".zip,.rar,.7z,.tar,.gz,.bz2">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传一个压缩文件，且不超过500MB</div>
            </el-upload>
        </section>
        <section v-if="fileReady" class="upload-form-container">
            <el-form :model="form" :rules="file_form_rules" ref="ruleForm" label-width="100px">
                <div class="form-row label-type">
                    <el-form-item label="标题" prop="headline">
                        <el-input v-model="form.headline"></el-input>
                    </el-form-item>

                    <el-form-item label="文件名" prop="fileName">
                        <el-input v-model="form.fileName" readonly></el-input>
                    </el-form-item>
                </div>

                <div class="form-row label-type">
                    <el-form-item label="类型" prop="categoryCode">
                        <el-select v-model="form.categoryCode" placeholder="请选择文件类型">
                            <el-option v-for="(type) in fileCategory" :label="type.categoryName"
                                :value="type.categoryCode"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="文件大小" prop="size">
                        <el-input v-model="form.size" readonly></el-input>
                    </el-form-item>
                </div>

                <div class="form-row label-type">
                    <el-form-item label="简介" prop="description">
                        <el-input v-model="form.description"></el-input>
                    </el-form-item>

                    <el-form-item label="私有/公开">
                        <el-switch v-model="form.display"></el-switch>
                    </el-form-item>
                </div>

                <!-- 👇 这个详细介绍项单独占一整行 -->
                <el-form-item class="full-width label-type" label="详细介绍" prop="introduce">
                    <el-input type="textarea" v-model="form.introduce" :rows="6"></el-input>
                </el-form-item>
            </el-form>
        </section>

        <section class="upload-img-container" v-if="fileReady">
            <label class="label-type">上传图片</label>
            <el-upload action="#" list-type="picture-card" :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove" :on-change="handleChangeImg" :auto-upload="false" accept="image/*">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <!-- 预览弹窗 -->
            <el-dialog v-model="dialogVisible" width="50%">
                <img width="100%" :src="dialogImageUrl" alt="预览图" />
            </el-dialog>
        </section>
        <footer class="form-buttons" v-if="fileReady">
            <el-button type="danger" style="width: 100px;" @click="resetForm()" plain>重置</el-button>
            <el-button type="primary" style="width: 100px;" @click="submitForm()" plain>提交</el-button>
        </footer>

        <UploadProgress v-if="start" :percentage="percentage" @cancel="cancel">
            {{ uploadInfo }}
        </UploadProgress>
    </main>

</template>

<style scoped>
main {
    padding: 50px;
    margin: 0 auto;
    min-height: calc(100vh - 150px);
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

.upload-file-container {
    padding: 20px;
    max-width: 40%;
    margin: 0 auto;
}

.label-type {
    display: block;
    font-weight: bold;
    font-size: 16px;
    color: rgb(166, 169, 173);
    letter-spacing: 1px;
    margin-bottom: 10px;
}


/* 专门针对文件大小标签的样式 */
.label-type :deep(.el-form-item__label) {
    font-weight: bold;
    font-size: 16px;
    color: rgb(166, 169, 173);
    letter-spacing: 1px;
    /* 字间距 */
}

.upload-form-container {
    max-width: 60%;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
}

.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.form-row .el-form-item {
    flex: 1;
    margin-bottom: 0;
}

/* 让"详细介绍"单独占满整行 */
.upload-form-container .full-width {
    width: 100%;
}

.upload-img-container {
    padding: 20px;
    max-width: 60%;
    margin: 0 auto;
}

.form-buttons {
    padding: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 80px;
    margin: 0 auto;
}
</style>
