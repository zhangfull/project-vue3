import { ElLoading, ElMessage } from 'element-plus'

export function openErrorNotice(message: string, duration = 3000) {
  ElMessage({
    message,
    type: 'error',
    duration,       // 自动消失时间
    showClose: false, // 不显示关闭按钮
    customClass: 'global-el-message'
  })
}

export function openSuccessNotice(message: string, duration = 3000) {
  ElMessage({
    message,
    type: 'success',
    duration,
    showClose: false,
    customClass: 'global-el-message'
  })
}

export function openInfoNotice(message: string, duration = 3000) {
  ElMessage({
    message,
    type: 'info',
    duration,
    showClose: false,
    customClass: 'global-el-message'
  })
}

export function openWarningNotice(message: string, duration = 3000) {
  ElMessage({
    message,
    type: 'warning',
    duration,
    showClose: false,
    customClass: 'global-el-message'
  })
}

// 创建加载组件的全局函数
export function createLoading(text: string = '加载中...') {
  return ElLoading.service({
    target: '.el-loading-parent--relative',
    background: 'rgba(0, 0, 0, 0.7)',
    text: text,
    spinner: 'el-icon-loading',
    customClass: 'custom-loading'
  })
}
