import axios from 'axios';
import type { CozeChunk } from '@/types/coze';

/**
 * 发送流式请求到 Coze 后端
 * @param prompt 用户输入
 * @param onChunk 接收每段流式数据的回调
 * @returns Promise<void>
 */
export const streamCoze = async (prompt: string, onChunk: (chunk: CozeChunk) => void) => {


  try {
    // 使用原生fetch API替代axios的stream选项，因为浏览器不支持responseType: 'stream'
    const response = await fetch('https://workspace.jeffisalone.site/coze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
      },
      body: JSON.stringify({ prompt }),
      signal: AbortSignal.timeout(30000) // 30秒超时
    });


    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 获取响应体的可读流
    if (!response.body) {
      throw new Error('响应体不可用');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // 用于检测是否接收到了任何有效的数据
    let receivedValidData = false;
    let startTime = Date.now();

    try {
      while (true) {
        const { done, value } = await reader.read();


        if (done) {

          // 如果缓冲区中还有未处理的数据，尝试处理
          if (buffer.trim()) {
            try {

              const chunk: CozeChunk = JSON.parse(buffer);
              onChunk(chunk);
              receivedValidData = true;
            } catch (error) {
              // 尝试作为普通文本处理
              if (buffer.trim()) {
                onChunk({ type: 'delta', content: buffer.trim() });
                receivedValidData = true;
              }
            }
          }

          // 如果整个流中没有接收到有效的completed事件，则手动发送
          if (receivedValidData) {
            onChunk({ type: 'completed', token_usage: 0 });
          } else {
            onChunk({ type: 'error', content: '未接收到有效响应数据' });
          }
          break;
        }

        // 解码二进制数据并累加缓冲区
        buffer += decoder.decode(value, { stream: true });

        // 按换行符分割完整的 JSON 块
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 剩余不完整的部分留到下次处理

        // 处理每个完整的 JSON 块
        for (const line of lines) {
          if (line.trim()) {
            try {
              // 尝试直接解析JSON
              const chunk: CozeChunk = JSON.parse(line);
              onChunk(chunk);
              receivedValidData = true;

              // 如果是completed类型，结束处理
              if (chunk.type === 'completed') {
                return;
              }
              // 如果是error类型，处理错误
              if (chunk.type === 'error') {
                console.error('接收到错误响应:', chunk.content);
              }
            } catch (error) {
              // 解析失败，可能是因为后端返回的不是标准JSON
              console.warn('解析JSON失败，尝试作为文本处理:', error, '数据:', line);
              // 将非JSON文本作为普通内容处理
              onChunk({ type: 'delta', content: line.trim() });
              receivedValidData = true;
            }
          }
        }
      }
    } finally {
      // 确保释放reader资源
      if (reader) {
        reader.releaseLock();
      }
    }
  } catch (error) {
    console.error('流式请求发送失败:', error);

    // 处理fetch API错误
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }

    // 处理特定错误类型
    if (errorMessage.includes('AbortError') || errorMessage.includes('timeout')) {
      errorMessage = '请求超时，请检查网络连接和服务器响应时间';
    } else if (errorMessage.includes('NetworkError')) {
      errorMessage = '网络连接错误，请检查您的网络';
    }

    onChunk({
      type: 'error',
      content: `流式请求失败:\n${errorMessage}\n\n请检查:\n1. Flask服务器是否在localhost:3000运行\n2. 网络连接是否正常\n3. 后端API配置是否正确`
    });
    throw new Error(errorMessage);
  }
}
