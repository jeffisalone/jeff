<template>

  <div class="coze-stream">
    <!-- 流式结果展示区 -->
    <div ref="outputRef" class="output" v-html="fullContent"></div>
    <!-- 输入区 -->
    <div class="input-area">
      <input
        v-model="prompt"
        type="text"
        placeholder="尽管问..."
        @keydown.enter="handleSend"
        style="background-color: #0b0b0b; color: #fff;border-radius: 8px;"
      />
    <StarBorder
        as="button"
        :color="color"
        :speed="speedProp"
        :thickness="thickness"
        @click="handleSend" :disabled="isLoading"
    >
      {{ isLoading ? '思考中...' : '发送' }}
    </StarBorder>
      <!-- <div id="submit_button" @click="handleSend" :disabled="isLoading"></div>
      {{ isLoading ? '思考中...' : '发送' }} -->
    </div>

    <!-- 状态提示 -->
    <div v-if="tokenUsage !== null" class="status">本次对话 token 用量: {{ tokenUsage }}</div>
  </div>
</template>

<script setup lang="ts">
  import StarBorder from './bits/StarBorder.vue'

import { ref, nextTick } from 'vue'
import { streamCoze } from './api/cozeApi'
import type { CozeChunk } from './types/coze'
import { marked } from 'marked'

const prompt = ref('')
const markdownContent = ref('') // 累积markdown格式的流式结果
const fullContent = ref('') // 累积渲染后的HTML结果
const isLoading = ref(false)
const tokenUsage = ref<number | null>(null)
const outputRef = ref<HTMLElement>()

// 配置marked选项
marked.setOptions({
  breaks: false, // 禁用将单个换行符转换为<br>
  gfm: true, // 启用GitHub风格的Markdown
  headerIds: false, // 禁用标题ID
  mangle: false // 禁用HTML标签转义
})

// 清理多余空行的函数
const cleanExcessNewlines = (content: string): string => {
  // 将连续3个或更多换行符替换为2个换行符
  return content.replace(/\n{3,}/g, '\n\n')
}

// 渲染markdown到HTML的函数
const renderMarkdown = (content: string): string => {
  try {
    // 先清理多余空行，再进行渲染
    const cleanedContent = cleanExcessNewlines(content)
    return marked(cleanedContent)
  } catch (error) {
    console.error('Markdown渲染失败:', error)
    return content // 失败时返回原始内容
  }
}

// 滚动到底部的函数
const scrollToBottom = () => {
  nextTick(() => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight
    }
  })
}

const handleSend = async () => {
    if (!prompt.value.trim() || isLoading.value) return

    // 重置状态
      markdownContent.value = ''
      fullContent.value = ''
      isLoading.value = true
      tokenUsage.value = null

    try {
      // 调用流式 API - 优化后的请求方式
      await streamCoze(prompt.value, (chunk: CozeChunk) => {
        console.log('收到响应块:', chunk);
        if (chunk.type === 'delta' && chunk.content) {
          // 实时追加增量markdown内容
          markdownContent.value += chunk.content;
          // 渲染为HTML
          fullContent.value = renderMarkdown(markdownContent.value);
          // 自动滚动到底部
          scrollToBottom();
        } else if (chunk.type === 'error') {
          // 收到错误响应
          const errorContent = '\n\n❌ ' + (chunk.content || '未知错误');
          markdownContent.value += errorContent;
          // 错误信息也进行markdown渲染，确保格式一致
          fullContent.value = renderMarkdown(markdownContent.value);
          // 如果有错误详情，在控制台打印但不展示给用户
          if (chunk.trace) {
            console.error('详细错误信息:', chunk.trace);
          }
          isLoading.value = false;
        } else if (chunk.type === 'completed') {
          // 对话完成，记录 token 用量
          tokenUsage.value = chunk.token_usage || null;
        }
      });
    } catch (error) {
      console.error('流式请求失败:', error);
      // 向用户显示详细的错误信息
      const errorContent = '\n\n❌ 流式请求失败，请检查：\n1. Flask服务器是否在localhost:3000运行\n2. 网络连接是否正常\n3. 后端API配置是否正确\n\n如需帮助，请查看控制台错误信息';
      markdownContent.value += errorContent;
      fullContent.value = renderMarkdown(markdownContent.value);
    } finally {
      // 结束加载状态
      isLoading.value = false;
      prompt.value = '';
    }
  }
</script>

<style scoped>
.coze-stream {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.output {
  min-height: 200px;
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #0b0b0b;
  color: #fff;
  padding: 15px;
  margin-bottom: 15px;
  white-space: pre-wrap; /* 保留换行和空格 */
  line-height: 1.6;
  height: 25rem;
  overflow: auto; /* 添加滚动条防止溢出 */
}

/* Markdown样式增强 */
.output :deep(h1),
.output :deep(h2),
.output :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.output :deep(h1) {
  font-size: 1.8em;
  border-bottom: 1px solid #333;
  padding-bottom: 0.3em;
}

.output :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}

.output :deep(h3) {
  font-size: 1.2em;
}

.output :deep(strong) {
  font-weight: 700;
  color: #eee;
}

.output :deep(em) {
  font-style: italic;
}

.output :deep(code) {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
}

.output :deep(pre) {
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 16px 0;
}

.output :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.output :deep(ul),
.output :deep(ol) {
  padding-left: 2em;
  margin: 1em 0;
}

.output :deep(li) {
  margin-bottom: 0.5em;
}

.output :deep(p) {
  margin-bottom: 1em;
}

.output :deep(a) {
  color: #42b983;
  text-decoration: none;
}

.output :deep(a:hover) {
  text-decoration: underline;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;

  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background: green;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.status {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

input:focus {
        outline: green;
        border: 1px solid green;
        border-radius: 8px;
    }

html, body {
    transform: scale(0.8);
    transform-origin: top left; /* 确保缩放从左上角开始 */
  }

  /* 自定义滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* 为output元素单独设置滚动条样式 */
  .output::-webkit-scrollbar {
    width: 8px;
  }

  .output::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }

  .output::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }

  .output::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
