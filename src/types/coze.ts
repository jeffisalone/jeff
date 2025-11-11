// 流式响应的分块类型
export interface CozeChunk {
  type: 'delta' | 'completed' | 'error' // delta：增量内容；completed：结束标记；error：错误信息
  content?: string // delta 和 error 类型有值
  token_usage?: number // 仅 completed 类型有值
  trace?: string // 错误详情（可选）
}
