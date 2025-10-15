import { type FileInfoForm, type FileListItem, type FilePage, type FilesRequestConditions, type FilterFilesConditions, type UploadPaths } from "@/types";
import axiosInstance from "./axiosInstance";
import { createLoading, openErrorNotice } from "@/utils/noticeUtils";
import { ref, type Ref } from "vue";

// 判断是否为搜索
export const handleIsSearch = (condition: FilterFilesConditions): boolean => {
    return (condition.searchTerm !== null && condition.searchTerm !== '') ||
        (condition.categoryCode !== null && condition.categoryCode !== 0) ||
        (condition.dateRange !== null && condition.dateRange !== '') ||
        (condition.order !== null && condition.order !== '');
};

export const handlePageAcquisition = async (condition: FilesRequestConditions): Promise<FilePage | null> => {
    console.log('execute: handlePageAcquisition()');
    if (condition.needPage < 1) {
        throw new Error('页码必须大于0');
    }

    if (condition.isFiltered === false) {
        condition.filters = null;
        console.log("未设置任何过滤条件");
    } else {
        console.log("设置过滤条件", condition.filters);
    }
    try {
        const fp: FilePage = {
            currentPage: 0,
            totalPages: 0,
            pageSize: 0,
            latestVersion: 0,
            results: []
        }
        const response = await axiosInstance.post('/api/file/getFiles',
            condition
        )
        const data = response.data.data
        console.log("后端返回的信息码：", response.data.code)              //调试
        console.log("后端返回的数据：", response.data.data)              //调试
        console.log('handlePageAcquisition() execute completed');
        if (data === null) {
            return fp;
        }
        if (data.latestVersion === undefined || data.latestVersion === null) {
            return fp;
        }
        fp.currentPage = data.currentPage;
        fp.totalPages = data.totalPages;
        fp.pageSize = data.pageSize;
        fp.latestVersion = data.latestVersion;
        fp.results = data.results
        return fp;
    } catch (error) {
        // 取消上传失败，捕获异常
        console.error('获取资源数据失败:', error)
        throw error;
    }
};

export const updated = async (
    uploadProgress: Ref<string>,
    percentage: Ref<number>,
    file: File | null,
    form: FileInfoForm,
    imgs: File[] | null
): Promise<boolean> => {
    if (file === null) {
        console.log('文件无效');
        return false
    }

    // first steep upload form
    console.log('execute: updated()');
    uploadProgress.value = '正在初始化仓库...'
    percentage.value = 5
    const urls: UploadPaths | null = await updateForm(form)
    if (urls === null) {
        console.log('updated() execute completed');
        return false;
    }

    // second step upload file

    uploadProgress.value = '正在上传文件(0/0)...'
    console.log("开始上传块...")
    const chunkSize = 4 * 1024 * 1024 // 每块4MB
    const totalChunks = Math.ceil(file.size / chunkSize)
    let reupload = 0
    const realFile: File = (file as any).raw instanceof File ? (file as any).raw : file;

    percentage.value = 10

    const uploadFormWeightPercentage = 10;      // 上传form占总进度的10%
    const uploadFileWeightPercentage = 80;      // 上传文件占总进度的80%
    const uploadCheckoutWeightPercentage = 10;  // 上传检验占总进度的10%

    for (let currentChunkIndex = 0; currentChunkIndex < totalChunks;) {
        // 获取当前要上传的块
        uploadProgress.value = '正在上传文件(' + (currentChunkIndex + 1) + '/' + totalChunks + ')...'
        const chunkProgress = ((currentChunkIndex + 1) / totalChunks) * uploadFileWeightPercentage;
        percentage.value = uploadFormWeightPercentage + chunkProgress;

        const start = currentChunkIndex * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        const chunk = realFile.slice(start, end);

        // 上传文件块
        const formData = new FormData();
        formData.append('uploadUrl', urls.filePath);                // Blob
        formData.append('chunkIndex', String(currentChunkIndex));    // 当前块号
        formData.append('chunkTotal', String(totalChunks));          // 总块数
        formData.append('chunkBLOB', chunk);         // 文件名

        const uploadResult = await uploadFile(formData)
        if (!uploadResult) {
            reupload += 1
            if (reupload > 3) {
                console.log('updated() execute completed chunk upload failed');
                return false
            }
        } else {
            currentChunkIndex += 1
        }
    }

    // third step merge file
    uploadProgress.value = '整理信息中...'
    const mergeResult = await mergeFile(form.fileName, totalChunks, urls.filePath)
    if (mergeResult) {
        uploadProgress.value = '文件上传成功'
        percentage.value = 100
    } else {
        return false
    }
    
    console.log('updated() execute completed');
    return true

};

// updated() children functions

// 1.update form
const updateForm = async (form: FileInfoForm): Promise<UploadPaths | null> => {
    try {
        console.log('execute: updateForm()');
        const response = await axiosInstance.post('/api/file/uploadForm',
            form
        )
        console.log("后端返回的信息码：", response.data.code)              //调试

        console.log('');
        console.log('updateForm() execute completed');
        if (response.data.code === 0) {
            console.log("后端返回的数据：", response.data.data)                //调试
            return response.data.data
        } else {
            console.log("后端返回的数据：", response.data.message)                //调试
            return null;
        }
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}

// 2.upload file
const uploadFile = async (data: FormData): Promise<boolean> => {
    console.log('execute: uploadFile()');
    try {
        const response = await axiosInstance.post('/api/file/uploadChunk',
            data
        )
        console.log('uploadFile() execute completed');
        console.log("后端返回的信息码：", response.data.code)              //调试
        return response.data.code === 0
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}

// 3.merge file
const mergeFile = async (fileName: string, totalNumber: number, path: string): Promise<boolean> => {
    console.log('execute: mergeFile()');
    try {
        const response = await axiosInstance.post('/api/file/mergeChunks',
            {
                fileName: fileName,
                totalNumber: totalNumber,
                path: path
            })
        console.log('mergeFile() execute completed');
        console.log("后端返回的信息码：", response.data.code)              //调试
        return response.data.code === 0
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}

// 4.upload imgs
