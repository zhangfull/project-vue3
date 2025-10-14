export const login_rules = {
  emailOrUid: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

export const register_rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value.length < 6) {
          callback(new Error('密码长度不能小于6位'))
        } else if (value.length > 20) {
          callback(new Error('密码长度不能大于20位'))
        } else if (value.includes(' ')) {
          callback(new Error('密码不能含空格'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' }
  ]
}

export const file_form_rules = {
  headline: [
    { required: true, message: '请输入文件标题', trigger: 'blur' }
  ],
  fileName: [
    { required: true, message: '请输入文件名', trigger: 'blur' }
  ],
  introduce: [
    { required: true, message: '请输入文件简介', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入文件描述', trigger: 'blur' }
  ],
  categoryCode: [
    { required: true, message: '请选择文件类型', trigger: 'change' }
  ],
  size: [
    { required: true, message: '请输入文件大小', trigger: 'blur' }
  ]
}

export const user_form_rules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur'},
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (!value) {
          callback(new Error('请输入用户名'))
        } else if (value.includes(' ')) {
          callback(new Error('用户名不能含空格'))
        } else if (value.trim() === '') {
          callback(new Error('用户名为空'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'blur' }
  ]
}

export const password_form_rules = (form: any) => ({
  oldPassword: [
      { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      {
          validator: (_rule: any, value: string, callback: Function) => {
              if (!value) return callback()
              if (value.length < 6) callback(new Error('密码长度不能小于6位'))
              else if (value.length > 20) callback(new Error('密码长度不能大于20位'))
              else if (value.includes(' ')) callback(new Error('密码不能含空格'))
              else callback()
          },
          trigger: 'change'
      }
  ],
  confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      {
          validator: (_rule: any, value: string, callback: Function) => {
              if (value !== form.newPassword) { // ✅ 通过 form.newPassword 拿到值
                  callback(new Error('两次密码不一致'))
              } else {
                  callback()
              }
          },
          trigger: 'change'
      }
  ]
})
