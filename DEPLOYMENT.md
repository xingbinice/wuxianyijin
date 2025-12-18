# 部署指南

## Vercel 部署

### 1. 准备工作

确保你已经：
- 创建了 Supabase 项目
- 获取了 Supabase URL 和匿名密钥
- 将代码推送到 GitHub

### 2. Vercel 环境变量配置（必须步骤）

⚠️ **重要**：环境变量必须在部署前配置，否则应用将无法正常运行！

#### 方法一：通过 Vercel Dashboard（推荐）

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 在 "Configure Project" 步骤中，点击 "Environment Variables"
5. 添加以下环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://sbnkwgunbdbpxjnojqbb.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibmt3Z3VuYmRicHhqbm9qcWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzM1MDcsImV4cCI6MjA4MTY0OTUwN30.Nn37_zQrP69OLlB7yX59B0qdl8N2Yev2YjKHVCyLm9Q`

#### 方法二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 设置环境变量（使用具体值）
vercel env add NEXT_PUBLIC_SUPABASE_URL
# 当提示时输入：https://sbnkwgunbdbpxjnojqbb.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# 当提示时输入你的密钥

# 部署
vercel --prod
```

### 3. 获取 Supabase 凭据

1. 访问 [supabase.com](https://supabase.com)
2. 选择你的项目
3. 进入 Settings > API
4. 复制以下信息：
   - Project URL（例如：https://xxxxxxxx.supabase.co）
   - anon public key（以 `eyJ` 开头的长字符串）

### 4. 部署步骤

1. **推送代码到 GitHub**（如果还没有）：
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **连接 Vercel 到 GitHub**：
   - 在 Vercel Dashboard 中点击 "Import Project"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测 Next.js 项目

3. **配置环境变量**：
   - 在项目设置中添加 Supabase 环境变量
   - 或者使用 `vercel.json` 中预配置的变量引用

4. **部署**：
   - 点击 "Deploy" 开始部署
   - 等待构建完成（通常需要 2-3 分钟）

### 5. 验证部署

部署完成后：
1. 访问 Vercel 提供的 URL
2. 检查应用是否正常加载
3. 尝试上传测试数据验证功能

### 6. 故障排除

#### 常见问题

**错误：Environment Variable references Secret which does not exist**
- 原因：vercel.json 中引用了不存在的 Secret
- 解决：删除 vercel.json 文件，通过 Vercel Dashboard 配置环境变量

**错误：数据库未配置，请联系管理员**
- 原因：环境变量未正确配置或为空
- 解决：检查 Vercel 项目设置中的环境变量，确保值正确

**错误：Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL**
- 原因：环境变量在构建时未设置或格式错误
- 解决：在部署前配置好所有环境变量

**错误：404 页面**
- 原因：构建失败或路由配置问题
- 解决：检查 Vercel 构建日志

**错误：Supabase 连接失败**
- 原因：Supabase URL 或密钥错误
- 解决：验证环境变量值是否正确

#### 调试步骤

1. 查看 Vercel 构建日志
2. 检查函数日志（Functions tab）
3. 验证 Supabase 项目是否正常运行
4. 测试本地环境变量是否有效

### 7. 自定义域名（可选）

在 Vercel 项目设置中：
1. 进入 "Domains" 标签
2. 添加你的自定义域名
3. 配置 DNS 记录

### 8. 生产环境优化

- 启用 Vercel Analytics
- 配置错误监控
- 设置自动部署规则
- 配置 CDN 缓存策略

## 本地开发

确保 `.env.local` 文件包含：

```env
NEXT_PUBLIC_SUPABASE_URL=你的supabase项目url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase匿名密钥
```

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。