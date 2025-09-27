<template>
  <div class="multi-source-list">
    <div class="left-panel" v-if="!hideLeftPanel">
      <slot></slot>
    </div>
    <div class="right-panel" :class="{ 'full-width': hideLeftPanel }">
      <div class="questions-preview-wrapper">
        <div class="questions-preview-box">
          <div class="diabled-edit-mask"></div>
          <MaterialGroup
            :current-edit-one="parseInt(currentEditOne)"
            :questionDataList="props.questionDataList"
          >
          </MaterialGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import MaterialGroup from '@/management/pages/edit/components/MaterialGroup.vue'

const currentEditOne = ref('')
const props = defineProps({
  questionDataList: {
    type: Array,
    default: () => []
  },
  hideLeftPanel: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.multi-source-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  .left-panel {
    flex: 1;
    height: 100%;
  }

  .right-panel {
    position: relative;
    flex-grow: 0;
    flex-shrink: 0;
    width: 50%;
    height: 100%;
    background-color: #f5f8f9;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.full-width {
      width: 100% !important;
      flex: 1 !important;
    }
    
    .questions-preview-wrapper {
      position: relative;
      width: 375px;
      height: 560px;
      max-height: 80%;
      background-color: #fff;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .questions-preview-box {
      position: relative;
    }
    .diabled-edit-mask {
      position: absolute;
      z-index: 999999;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0);
    }
  }
}

// Responsive design untuk mobile
@media (max-width: 768px) {
  .multi-source-list {
    flex-direction: column;
    
    .left-panel {
      width: 100%;
      flex: none;
    }
    
    .right-panel {
      width: 100% !important;
      flex: 1;
      
      .questions-preview-wrapper {
        width: 100%;
        max-width: 375px;
        height: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>