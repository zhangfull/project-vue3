import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { openErrorNotice } from './utils/noticeUtils'
import '@/style.css'

const app = createApp(App)
app.config.errorHandler = (err, instance, info) => {
    console.error('全局捕获错误:', err)
    if (instance) {
        console.error('组件实例:', instance.$options.name || "非组件错误")
    }
    console.log('错误信息:', info)
    const errorMessage = typeof err === 'object' && err !== null && 'message' in err ? (err as { message?: string }).message : String(err)
    //openErrorNotice(errorMessage || '未知错误')
    console.log(errorMessage || '未知错误');
    
    // 可以发送到日志服务或后端
}
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
