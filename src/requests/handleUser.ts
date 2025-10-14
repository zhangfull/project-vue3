import type { UploadUserRequestBody, UserInfoResponseData } from "@/types";
import axiosInstance from "./axiosInstance";
import { openErrorNotice, openSuccessNotice } from "@/utils/noticeUtils";

export const handleGetUserInfo = async (): Promise<UserInfoResponseData | null> => {
    console.log('execute: handleGetUserInfo()');
    try {
        const response = await axiosInstance.get(
            '/api/user/getInfo'
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        console.log('handleGetUserInfo() execute completed');

        if (response.data.code !== 0) {
            openErrorNotice("个人信息加载失败")
            return null
        } else {
            return response.data.data
        }
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
};

export const handleUpdateUserInfo = async (data: UploadUserRequestBody): Promise<boolean> => {
    try {
        const response = await axiosInstance.post(
            '/api/user/update', data
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        console.log('handleUpdateUserInfo() execute completed');
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        if (response.data.code === 0) {
            openSuccessNotice('更改成功')
            return true
        } else {
            openErrorNotice('更改失败')
            return false
        }
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}

export const handleUpdateUserPassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    console.log('execute: handleUpdateUserPassword()');
    try {
        const response = await axiosInstance.post(
            '/api/user/updatePassword', { oldPassword, newPassword }
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        console.log('handleUpdateUserPassword() execute completed');
        if (response.data.code === 0) {
            openSuccessNotice('更改成功')
            return true
        } else {
            openErrorNotice(response.data.message)
            return false
        }
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
}
