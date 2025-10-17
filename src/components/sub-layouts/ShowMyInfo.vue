<script setup lang="ts">

import '@/css/text.css'
import { useLoginStore } from '@/stores/loginStore';
import type { UserInfoResponseData } from '@/types';
import { ref, watch } from 'vue';
import UpdatePassword from '@/components/dialog/UpdatePassword.vue';

const loginStore = useLoginStore();
const props = defineProps<{
  personalInfo: UserInfoResponseData | null
}>()
const emits = defineEmits<{
  (e: 'update:turn'): void
}>()

function edit() {
  emits('update:turn')
}
const isUpdatePassWord = ref(false)
function logout() {
  loginStore.logout();
  window.location.replace('/')
}
const avatarBase64 = ref(loginStore.avatarBase64)
watch(() => loginStore.avatarBase64, () => {
  avatarBase64.value = loginStore.avatarBase64
})

function getSex(sex: string | undefined) {
  if (sex === 'man') {
    return '男'
  } else if (sex === 'women') {
    return '女'
  } else {
    return '隐藏'
  }
}
</script>

<template>
  <main>
    <header>
      <h1>用户信息</h1>
    </header>
    <section>
      <h2>基本信息</h2>
      <dl>
        <dt>头像</dt>
        <dd>
          <el-avatar shape="square" :size="100" fit="cover" :src="avatarBase64"></el-avatar>
          <router-link to="/individual/update-avatar" style="color: cadetblue;">点击更换</router-link>
        </dd>
        <dt>用户名</dt>
        <dd>{{ props.personalInfo?.name }}</dd>
        <dt>UID</dt>
        <dd>{{ props.personalInfo?.uid }}</dd>
        <dt>性别</dt>
        <dd>{{ getSex(props.personalInfo?.sex) }}</dd>
        <dt>邮箱</dt>
        <dd>{{ props.personalInfo?.email }}</dd>
        <dt>注册日期</dt>
        <dd>{{ props.personalInfo?.registrationDate }}</dd>
        <dt>关注数量</dt>
        <dd>{{ props.personalInfo?.myFollowersCount }}</dd>
        <dt>粉丝数量</dt>
        <dd>{{ props.personalInfo?.followersCount }}</dd>
        <dt>简介</dt>
        <dd>{{ props.personalInfo?.briefIntroduction }}</dd>
      </dl>
    </section>
    <section class="buttons-section">
      <el-button @click="edit" type="info" plain>编辑信息</el-button>
      <el-button type="warning" plain @click="isUpdatePassWord = true">修改密码</el-button>
      <el-button type="danger" plain @click="logout">退出登录</el-button>
    </section>
    <UpdatePassword v-if="isUpdatePassWord" @update:close="() => isUpdatePassWord = false" />
  </main>
</template>

<style scoped>
main {
  max-width: 80%;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

section {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

section h2 {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}


.buttons-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 120px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  main {
    padding: 1rem;
  }

  .buttons-section {
    flex-direction: column;
    align-items: stretch;
  }

  button {
    width: 100%;
  }
}

</style>
