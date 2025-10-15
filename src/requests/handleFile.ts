import { type FileInfoForm, type FileListItem, type FilePage, type FilesRequestConditions, type FilterFilesConditions, type UploadUrls } from "@/types";
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
    // if (form) {
    //     console.log(form);
    // }
    // if (file) {
    //     console.log(file.size);
    // }

    // if (imgs) {
    //     for (const img of imgs) {
    //         console.log(img.size);
    //     }
    // }

    // first steep upload form
    console.log('execute: updated()');
    uploadProgress.value = '正在初始化仓库...'
    percentage.value = 5
    const urls: UploadUrls | null = await updateForm(form)
    if (urls === null) {
        console.log('updated() execute completed');
        openErrorNotice('仓库初始化失败')
        return false;
    }
    // console.log(urls);
    
    // second step upload file

    console.log('updated() execute completed');
    return true

};

// updated() children functions

// 1.update form
export const updateForm = async (form: FileInfoForm): Promise<UploadUrls | null> => {
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

export const uploadFile = async (file: File): Promise<boolean> => {
    console.log('execute: uploadFile()');
    try {
        const response = await axiosInstance.post('/api/file/uploadFile',
            file
        )
        console.log("后端返回的信息码：", response.data.code)              //调试
        console.log("后端返回的数据：", response.data.data)                //调试
        console.log('uploadFile() execute completed');
        return response.data.code === 0
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}

// 3.upload imgs