import { openErrorNotice, openSuccessNotice } from "@/utils/noticeUtils";
import axiosInstance from "./axiosInstance";

export const handleGetAvatar = async (url: string): Promise<string> => {
    console.log(`execute: handleGetAvatar( ${url} )`);

    try {
        const response = await axiosInstance.post('/api/user/getAvatarBase64',
            { url }
        )
        console.log("后端返回的信息码：", response.data.code)              //调试
        console.log('handleGetAvatar() execute completed');

        if (response.data.code === 0) {
            return response.data.data
        } else {
            openErrorNotice('头像加载失败')
            return ''
        }
    } catch (error) {
        console.error('请求失败:', error)
        throw error;
    }
};

export const handleSetAvatar = async (file: File): Promise<boolean> => {
    console.log(`execute: handleSetAvatar()`);
    const formData = new FormData();
    formData.append('avatar', file);
    try {
        const response = await axiosInstance.post('/api/user/uploadAvatar',
            formData
        )
        console.log("后端返回的信息码：", response.data.code)              //调试
        console.log("后端返回的数据：", response.data.data)                //调试
        console.log('handleSetAvatar() execute completed');
        response.data.code === 0 ? openSuccessNotice('头像上传成功') : openErrorNotice('头像上传失败')
        return response.data.code === 0
    } catch (error) {
        console.error('请求失败:', error)
        throw error;
    }
};


export const uploadFileImgs = async (filePath: string, imgs: File[], id: number): Promise<boolean> => {
    console.log('execute: uploadImgs()');
    const form = new FormData();
    // 遍历文件数组，为每个文件单独添加到FormData
    imgs.forEach((img, index) => {
        form.append('imgs', img);
    });
    form.append('filePath', filePath);
    form.append('id', id.toString());
    try {
        const response = await axiosInstance.post('/api/file/uploadImgs',
            form,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        console.log('uploadImgs() execute completed');
        console.log("后端返回的信息码：", response.data.code)              //调试
        return response.data.code === 0
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}