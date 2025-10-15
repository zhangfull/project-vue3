// stores/user.ts

import { handleGetAvatar } from "@/requests/handleImg"
import { handleInitializeLogin, handleRefreshLogin } from "@/requests/handleLogin"
import type { LoginResponseData } from "@/types"
import { openErrorNotice } from "@/utils/noticeUtils"
import { defineStore } from "pinia"


interface UserState {
    avatarUrl: string
    avatarBase64: string
    accessToken: string | null
}

export const useLoginStore = defineStore('user', {
    state: (): UserState => ({
        avatarUrl: '',
        avatarBase64: '',
        accessToken: null
    }),
    actions: {
        async setUser(userInfo: LoginResponseData) {
            localStorage.setItem('accessToken', userInfo.accessToken)
            this.avatarUrl = userInfo.avatarUrl
            this.avatarBase64 = await handleGetAvatar(this.avatarUrl)
        },
        async refreshAvatarBase64() {
            this.avatarBase64 = await handleGetAvatar(this.avatarUrl)
        },

        logout() {
            this.avatarUrl = ''
            this.accessToken = null
            this.avatarBase64 = ''
            localStorage.removeItem('accessToken')
        },
        loadTokenFromStorage() {
            const token = localStorage.getItem('accessToken')
            if (token) {
                this.accessToken = token
                console.log("重新加载了 token");
            }
        },
        async refreshLogin() {
            const login = await handleRefreshLogin();
            if (!login) {
                if (await handleInitializeLogin()) {
                    openErrorNotice('登陆信息过期，请刷新界面')
                } else {
                    openErrorNotice('登陆信息过期，请重新登陆')
                }
            }
            return 
        }
    }
})
