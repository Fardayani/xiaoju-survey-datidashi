<template>
  <div class="text-import-page">

    <!-- Mobile Toggle Button -->
    <div v-if="isMobile" class="mobile-preview-toggle">
      <el-button 
        type="primary" 
        class="preview-toggle-btn"
        @click="showMobilePreview = !showMobilePreview"
      >
        <i class="icon-preview"></i>
        {{ showMobilePreview ? '隐藏预览' : '显示预览' }}
        ({{ previewQuestionList.length }})
      </el-button>
    </div>

    <!-- Desktop: Always show side by side -->
    <!-- Mobile: Show based on toggle state -->
    <div class="layout-container" :class="{ 'mobile-preview-active': showMobilePreview }">
      <div class="input-section" :class="{ 'mobile-full': isMobile && !showMobilePreview }">
        <MultiSourcePreviewPanel 
          :questionDataList="previewQuestionList" 
          :hide-left-panel="false"
        >
          <div class="text-import-wrapper">
            <div class="nav">
              <div class="nav-content">
                <h2 class="nav-title">输入区</h2>
                <el-button type="primary" class="example-btn" @click="showExample = true">
                  <i class="icon-example"></i>
                  示例输入
                </el-button>
              </div>
            </div>
            <div class="text-input-container">
              <label for="question-text-input" class="visually-hidden">输入问题文本</label>
              <textarea 
                id="question-text-input"
                class="text-input" 
                v-model="text" 
                @input="onInput"
                placeholder="在此输入问题文本..."
              ></textarea>
              <div v-if="!text" class="placeholder-container">
                <div class="placeholder-content">
                  <i class="icon-upload"></i>
                  <p class="placeholder-text">输入区</p>
                  <p class="placeholder-subtext">在此键入或粘贴您的问题文本</p>
                </div>
              </div>
            </div>
          </div>
        </MultiSourcePreviewPanel>
        
        <!-- Mobile: Input only view -->
        <div v-if="isMobile && !showMobilePreview" class="text-import-wrapper mobile-input-view">
          <div class="nav">
            <div class="nav-content">
              <h2 class="nav-title">输入区</h2>
              <el-button type="primary" class="example-btn" @click="showExample = true">
                <i class="icon-example"></i>
                示例输入
              </el-button>
            </div>
          </div>
          <div class="text-input-container">
            <label for="question-text-input-mobile" class="visually-hidden">输入问题文本</label>
            <textarea 
              id="question-text-input-mobile"
              class="text-input" 
              v-model="text" 
              @input="onInput"
              placeholder="Masukkan teks pertanyaan di sini..."
            ></textarea>
            <div v-if="!text" class="placeholder-container">
              <div class="placeholder-content">
                <i class="icon-upload"></i>
                <p class="placeholder-text">输入区</p>
                <p class="placeholder-subtext">Ketik atau tempel teks pertanyaan Anda di sini</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Preview Panel (separate when toggled) -->
        <div v-if="isMobile && showMobilePreview" class="mobile-preview-section">
          <div class="preview-header">
            <h3>问题预览</h3>
            <el-button 
              type="primary" 
              link 
              class="close-preview-btn"
              @click="showMobilePreview = false"
            >
              <i class="icon-close"></i>
              关闭
            </el-button>
          </div>
          <div class="preview-content">
            <MultiSourcePreviewPanel 
              :questionDataList="previewQuestionList" 
              :hideLeftPanel="true"
            />
          </div>
        </div>
      </div>
      
      <el-dialog
        v-model="showExample"
        title="编辑示例" 
        class="example-dialog"
        :width="dialogWidth"
      >
        <template #header>
          <div class="dialog-header">
            <h3>输入格式示例</h3>
            <p>选择适合您需求的示例格式</p>
          </div>
        </template>
        
        <div class="question-example-wrapper">
          <div 
            v-for="item in importExamples" 
            :key="item.type" 
            :id="`copy-${item.type}-example-wrapper`" 
            class="questionType-example"
          >
            <div class="example-header">
              <p class="example-title">{{ item.title }}</p>
              <span class="example-badge">{{ item.type }}</span>
            </div>
            <div class="example-content">
              <pre class="example-code"><code>{{ item.content }}</code></pre>
              <el-button 
                type="primary" 
                link 
                class="copy-btn" 
                @click="coypText(item)"
              >
                <i class="icon-copy"></i>
                复制文本
              </el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </template>

  <script setup lang="ts">
  import MultiSourcePreviewPanel from '@/management/components/MultiSourcePreviewPanel.vue';
  import { computed, reactive, ref, onMounted, onUnmounted } from 'vue';
  import { debounce } from 'lodash-es'
  import { textToSchema } from '@/management/utils/textToSchema';
  import { filterQuestionPreviewData } from '@/management/utils/index'
  import textImportExample from '@/management/config/textImportExample'
  import copy from 'copy-to-clipboard'
  import { ElMessage } from 'element-plus';

  const emit = defineEmits(['change'])

  const text = ref('')
  const showExample = ref(false)
  const showMobilePreview = ref(false)
  const windowWidth = ref(window.innerWidth)

  const questionList = reactive([] as Array<Record<string, any>>)

  const isMobile = computed(() => {
    return windowWidth.value < 768
  })

  const debouncedTransform = debounce(() => {
    if (questionList.length === 0) {
      questionList.push(...textToSchema(text.value))
      emit('change', [...questionList])
      return
    }
    questionList.splice(0, questionList.length, ...textToSchema(text.value))
    emit('change', [...questionList])
  }, 500)

  const previewQuestionList = computed(() => {
    const ret = filterQuestionPreviewData(questionList)
    return ret
  })

  const importExamples = computed(() => {
    return textImportExample
  })

  const dialogWidth = computed(() => {
    return windowWidth.value < 768 ? '90%' : windowWidth.value < 1024 ? '600px' : '700px'
  })

  const onInput = () => {
    debouncedTransform()
  }

  const coypText = (item: { content: string }) => {
    const data = copy(item.content)
    if (data) {
      ElMessage({
        type: 'success',
        message: '复制成功！'
      })
    }
  }

  const handleResize = () => {
    windowWidth.value = window.innerWidth
    // Auto close mobile preview when resizing to desktop
    if (windowWidth.value >= 768) {
      showMobilePreview.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
  </script>

  <style lang="scss" scoped>
  .text-import-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }

  /* Visually hidden class for accessible labels */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  /* Mobile Preview Toggle Button */
  .mobile-preview-toggle {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    padding: 10px;
    border-bottom: 1px solid #e1e5e9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .preview-toggle-btn {
      width: 100%;
      background: linear-gradient(135deg, #ffa600 0%, #d48d00 100%);
      color: white;
      border: none;
      padding: 12px;
      font-size: 14px;
      font-weight: 600;
      
      &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
    }
  }

  .layout-container {
    display: flex;
    flex: 1;
    height: calc(100vh - 60px); // Adjust for toggle button height
    
    &.mobile-preview-active {
      .input-section {
        display: none;
      }
    }
  }

  .input-section {
    flex: 1;
    height: 100%;
    
    &.mobile-full {
      width: 100%;
    }
  }

  .text-import-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: relative;
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    &.mobile-input-view {
      border-radius: 0;
      box-shadow: none;
      height: 100%;
    }
    
    .nav {
      width: 100%;
      background: linear-gradient(135deg, #ffa600 0%, #d48d00 100%);
      color: white;
      padding: 0;
      
      .nav-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        
        .nav-title {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }
        
        .example-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.3s ease;
          
          &:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
          }
          
          .icon-example {
            margin-right: 4px;
          }
        }
      }
    }
    
    .text-input-container {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      
      .text-input {
        width: 100%;
        height: 100%;
        padding: 16px;
        border: none;
        background: #fff;
        resize: none;
        font-size: 14px;
        line-height: 1.5;
        color: #2c3e50;
        min-height: 200px;
        font-family: inherit;
        
        &:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.8);
        }
        
        &::placeholder {
          color: #a0a0a0;
          font-size: 14px;
        }
      }
      
      .placeholder-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        
        .placeholder-content {
          text-align: center;
          color: #a0a0a0;
          
          .icon-upload {
            font-size: 32px;
            margin-bottom: 12px;
            opacity: 0.5;
          }
          
          .placeholder-text {
            font-size: 14px;
            font-weight: 300;
            margin: 0 0 6px 0;
            color: #bdc3c7;
          }
          
          .placeholder-subtext {
            font-size: 14px;
            margin: 0;
            opacity: 0.7;
          }
        }
      }
    }
  }

  /* Mobile Preview Section */
  .mobile-preview-section {
    width: 100%;
    height: 100%;
    background: white;
    
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: linear-gradient(135deg, #ffa600 0%, #d48d00 100%);
      color: white;
      
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .close-preview-btn {
        color: white;
        font-size: 14px;
        
        &:hover {
          opacity: 0.8;
        }
      }
    }
    
    .preview-content {
      height: calc(100% - 60px);
      overflow-y: auto;
    }
  }

  /* Dialog Styles */
  .example-dialog {
    .dialog-header {
      h3 {
        margin: 0 0 4px 0;
        color: #2c3e50;
        font-size: 14px;
      }
      
      p {
        margin: 0;
        color: #7f8c8d;
        font-size: 14px;
      }
    }
  }

  .question-example-wrapper {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 8px;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 2px;
    }
  }

  .questionType-example {
    background: #fff;
    border: 1px solid #e1e5e9;
    border-radius: 6px;
    margin-bottom: 12px;
    padding: 0;
    overflow: hidden;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
    }
    
    .example-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #e1e5e9;
      
      .example-title {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #2c3e50;
      }
      
      .example-badge {
        background: #667eea;
        color: white;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
      }
    }
    
    .example-content {
      padding: 12px 16px;
      
      .example-code {
        background: #f8f9fa;
        border: 1px solid #e1e5e9;
        border-radius: 4px;
        padding: 12px;
        margin: 0 0 10px 0;
        overflow-x: auto;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 14px;
        line-height: 1.4;
        color: #2c3e50;
        
        code {
          white-space: pre-wrap;
          word-break: break-word;
        }
      }
      
      .copy-btn {
        display: flex;
        align-items: center;
        color: #667eea;
        font-weight: 500;
        padding: 4px 0;
        font-size: 14px;
        
        .icon-copy {
          margin-right: 4px;
        }
        
        &:hover {
          color: #5a6fd8;
        }
      }
    }
  }

  /* Icons */
  .icon-example::before { content: "📋"; font-size: 14px; }
  .icon-upload::before { content: "📥"; }
  .icon-copy::before { content: "⎘"; font-size: 14px; }
  .icon-preview::before { content: "👁"; margin-right: 6px; }
  .icon-close::before { content: "✕"; margin-right: 4px; }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .text-import-page {
      min-width: unset;
    }
    
    .text-import-wrapper {
      .nav {
        .nav-content {
          padding: 10px 16px;
          
          .nav-title {
            font-size: 14px;
          }
          
          .example-btn {
            font-size: 14px;
            padding: 5px 10px;
          }
        }
      }
      
      .text-input-container {
        .text-input {
          padding: 14px;
          font-size: 13px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .layout-container {
      height: calc(100vh - 50px);
    }
    
    .text-import-wrapper {
      border-radius: 0;
      
      .nav {
        .nav-content {
          padding: 8px 12px;
          
          .nav-title {
            font-size: 14px;
          }
          
          .example-btn {
            font-size: 14px;
            padding: 4px 8px;
          }
        }
      }
      
      .text-input-container {
        .text-input {
          padding: 12px;
          font-size: 12px;
          min-height: 150px;
        }
      }
    }
    
    .questionType-example {
      .example-header {
        padding: 10px 12px;
        
        .example-title {
          font-size: 14px;
        }
      }
      
      .example-content {
        padding: 10px 12px;
        
        .example-code {
          padding: 10px;
          font-size: 14px;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .mobile-preview-toggle {
      padding: 8px;
      
      .preview-toggle-btn {
        padding: 10px;
        font-size: 13px;
      }
    }
    
    .mobile-preview-section {
      .preview-header {
        padding: 10px 12px;
        
        h3 {
          font-size: 14px;
        }
      }
    }
  }

  /* Animation for smooth transitions */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }

  .slide-enter-active, .slide-leave-active {
    transition: transform 0.3s ease;
  }

  .slide-enter-from, .slide-leave-to {
    transform: translateX(100%);
  }
  </style>