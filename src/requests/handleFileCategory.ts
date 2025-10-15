import type { Category } from "@/types";
import axiosInstance from "./axiosInstance";

export const handleGetFileCategories = async (): Promise<Category[]> => {
    console.log('execute: handleGetFileCategories()');
    try {
        const response = await axiosInstance.get('/api/fileCategory/getAll')
        console.log("后端返回的信息码：", response.data.code)
        console.log("后端返回的数据：", response.data.data)
        console.log('handleGetFileCategories() execute completed');
        return response.data.data
    } catch (error) {
        console.error('获取资源数据失败:', error)
        throw error;
    }
};