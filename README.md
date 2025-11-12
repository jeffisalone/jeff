# 交院大明白 - AI助手项目
这是一个结合Vue 3前端和Flask后端的AI聊天助手应用，提供智能对话和信息查询功能，支持流式响应和Markdown渲染。

## 项目架构

### 前端架构
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **渲染引擎**: 支持Markdown格式化输出
- **UI组件**: 自定义组件 + Element Plus
- **动画效果**: GSAP, Motion-V, VueBits

### 后端架构
- **框架**: Flask (Python)
- **AI集成**: Coze API (cozepy)
- **跨域支持**: Flask-CORS
- **API端点**: RESTful设计
- **AI智能体**: COZE AGENT



## 核心功能

### 1. 流式响应聊天
- 支持AI回复的实时流式展示

### 2. 用户交互
- 简洁的聊天界面
- 自定义美化的滚动条
- 响应式设计，适配不同设备

### 3. 技术亮点
- 使用Vue 3 Composition API和TypeScript
- 原生Fetch API实现流式响应处理
- 错误处理和超时控制
- 自定义CSS动画和过渡效果

## 安装与开发

### 前置要求
- **Node.js**: v20.19.0 或更高版本
- **Python**: 3.8+
- **包管理器**: Bun (前端), pip (后端)

### 前端安装

1. 进入前端目录
```bash
cd vueApp
```

2. 安装依赖
```bash
bun install
```

3. 启动开发服务器
```bash
bun dev
```

### 后端安装

1. 进入后端目录
```bash
cd backend
```

2. 安装依赖
```bash
pip install -r requirements.txt
```

3. 启动Flask服务器
```bash
python test.py
```

## 环境配置

### 前端配置
- **开发地址**: http://localhost:5173
- **构建命令**: `bun run build`
- **代码检查**: `bun lint`

### 后端配置
- **服务地址**: http://localhost:3000
- **API端点**: 
  - POST `/coze`: 流式AI响应
  - GET `/test`: 健康检查
- **CORS配置**: 允许http://localhost:5173和http://47.93.254.56:5173

## API接口说明

### 发送聊天消息

**URL**: `/coze`
**方法**: `POST`
**请求体**:
```json
{
  "prompt": "您的问题或指令"
}
```

**响应格式**:
流式响应，每个数据块格式为:
```json
{
  "type": "delta",  // delta:增量内容, completed:完成标记, error:错误信息
  "content": "AI回复内容"  // 仅delta和error类型有值
}
```

## 开发指南

### 代码规范
- 前端使用ESLint和Prettier进行代码检查和格式化
- TypeScript类型检查确保类型安全
- 遵循Vue 3最佳实践

### 调试工具
- Vue DevTools浏览器插件
- Chrome/Firefox开发者工具
- 后端日志输出

### 性能优化
- 使用Vite的开发服务器实现快速热更新
- 流式响应减少等待时间
- 懒加载和组件按需导入

## 部署说明

### 前端构建
```bash
bun run build
```
构建产物位于`dist`目录，可部署到任何静态文件服务器。

### 后端部署
- 使用Gunicorn或uWSGI作为WSGI服务器
- 配置生产环境的环境变量
- 建议配合Nginx进行反向代理

## 故障排查

### 常见问题
1. **后端连接失败**:
   - 检查Flask服务器是否运行
   - 验证端口3000是否被占用

2. **CORS错误**:
   - 确保前端地址在后端CORS配置中
   - 检查浏览器控制台错误信息

3. **流式响应不工作**:
   - 验证网络连接
   - 检查Coze API密钥配置

## 许可证

[MIT](LICENSE)

## 贡献指南

欢迎提交Issue和Pull Request！

## 联系方式

如有问题或建议，请联系项目维护者。