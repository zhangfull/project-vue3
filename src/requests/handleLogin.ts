import type { LoginResponseData, RegisterRequestData } from "@/types";
import axiosInstance from "./axiosInstance";
import { useLoginStore } from "@/stores/loginStore";
import { openErrorNotice, openSuccessNotice } from "@/utils/noticeUtils";


export const handleRegister = async (data: RegisterRequestData): Promise<boolean> => {
    console.log(`execute: handleRegister( ${data} )`);
    try {
        const response = await axiosInstance.post(
            '/api/login/register',
            data
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        const success = response.data.code === 0
        success ? openSuccessNotice(response.data.message) : openErrorNotice(response.data.message)
        console.log('handleRegister() execute completed');
        return success
    } catch (error) {
        console.error('请求失败:', error)
        throw error;
    }
};

export const handleActiveLogin = async (emailOrUid: string, password: string): Promise<boolean> => {
    console.log(`execute: handleLogin(  ${emailOrUid}, ${password} )`);
    try {
        const response = await axiosInstance.post(
            '/api/login/active',
            {
                emailOrUid: emailOrUid,
                password: password
            }
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        const success = response.data.code === 0
        if (success) {
            const data: LoginResponseData = response.data.data
            await useLoginStore().setUser(data)
            openSuccessNotice('登录成功')
        } else {
            openErrorNotice(response.data.message)
        }
        console.log('handleRegister() execute completed');
        return success
    } catch (error) {
        console.error('请求失败:', error)
        throw error;
    }
};

export const handleAutoLogin = async (): Promise<boolean> => {
    console.log('execute: handleLogin()');
    try {
        const response = await axiosInstance.post(
            '/api/login/refresh', {}, { withCredentials: true }
        )
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        const success = response.data.code === 0
        if (success) {
            const data: LoginResponseData = response.data.data
            await useLoginStore().setUser(data)
        } else {
            openErrorNotice(response.data.message)
        }
        console.log('handleRegister() execute completed');
        return success
    } catch (error) {
        console.error('请求失败:', error)
        throw error;
    }
};



