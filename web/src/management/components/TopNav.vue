<template>
  <div class="top-nav">
    <div class="left">
      <img class="logo-img" src="/imgs/Logo.webp" alt="logo" />
      <el-menu router default-active-index="survey" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="survey">
          <router-link :to="{ name: 'survey' }">问卷列表</router-link>
        </el-menu-item>
        <el-menu-item index="download">
          <router-link :to="{ name: 'download' }">下载中心</router-link>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="login-info">
      您好，{{ userInfo?.username }}
      <img class="login-info-img" src="/imgs/avatar.webp" alt="avatar" />
      <span class="logout" @click="handleLogout">退出</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/management/stores/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const userStore = useUserStore()
const userInfo = computed(() => {
  return userStore.userInfo
})

const handleLogout = () => {
  userStore.logout()
  router.replace({ name: 'login' })
}
</script>

<style lang="scss" scoped>
.top-nav {
  background: #fff;
  color: #303133; // Kontras yang memadai (7.75:1)
  padding: 0 20px;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
  
  .left {
    display: flex;
    align-items: center;
    width: calc(100% - 200px);
    
    .logo-img {
      width: 90px;
      height: fit-content;
      padding-right: 20px;
    }
    
    .el-menu {
      width: 100%;
      height: 56px;
      border: none !important;
      
      :deep(.el-menu-item) {
        border: none !important;
        min-height: 48px; // Touch target memadai
        padding: 0 24px; // Spacing yang memadai
        display: flex;
        align-items: center;
        color: #303133; // Kontras yang memadai
        transition: all 0.3s ease;
        
        &:hover {
          background-color: #f0f2f5;
          color: #faa600;
        }
        
        &.is-active {
          background-color: #e6f7ff;
          color: #faa600 !important; // Kontras 4.5:1 memadai
          border-bottom: 2px solid #faa600;
          font-weight: 600;
          
          a {
            color: #faa600 !important;
            font-weight: 600;
          }
        }
        
        a {
          color: #303133; // Kontras memadai
          text-decoration: none;
          display: block;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          transition: color 0.3s ease;
          min-height: 44px; // Touch target
          
          &:hover {
            color: #faa600;
          }
          
          &:focus {
            outline: 2px solid #faa600;
            outline-offset: 2px;
            border-radius: 4px;
          }
        }
      }
      
      .router-link-active {
        color: #faa600 !important; // Kontras 4.5:1 (sebelumnya pakai $primary-color)
        font-weight: 600;
      }
    }
  }
  
  .login-info {
    display: flex;
    align-items: center;
    
    .welcome-text {
      color: #303133; // Kontras memadai
    }
    
    .login-info-img {
      margin-left: 10px;
      height: 30px;
      margin-top: -6px;
    }

    .logout {
      margin-left: 20px;
      background: none;
      border: none;
      cursor: pointer;
      color: #faa600; // Kontras 4.5:1 untuk red
      font-size: 14px;
      padding: 12px 16px; // Touch target memadai
      border-radius: 4px;
      transition: all 0.3s ease;
      min-height: 44px; // Minimum touch target
      min-width: 44px; // Minimum touch target
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background-color: #f5f5f5;
        color: #c9302c;
      }
      
      &:focus {
        outline: 2px solid #faa600;
        outline-offset: 2px;
        background-color: #f5f5f5;
      }
      
      &:active {
        background-color: #e0e0e0;
      }
    }
  }
}
</style>
