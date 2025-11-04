import type { UploaderListItem } from "@/types"
import axiosInstance from "./axiosInstance"

export const getHistory = async (): Promise<UploaderListItem[]> => {
    const response = await axiosInstance.get(
        '/api/uploader/getHistory'
    )
    return response.data.data
}