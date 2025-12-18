# Supabase配置指南

## 1. 创建Supabase项目

### 步骤1：注册和登录
1. 访问 [Supabase官网](https://supabase.com)
2. 点击"Sign Up"使用GitHub或邮箱注册
3. 登录后进入Dashboard

### 步骤2：创建新项目
1. 点击"New Project"按钮
2. 选择或创建Organization（组织）
3. 填写项目信息：
   - **Project Name**: `wuxianyijin`
   - **Database Password**: 设置强密码（请记住）
   - **Region**: 选择 `East Asia Southeast`（或其他离您近的区域）
4. 点击"Create new project"

### 步骤3：等待项目创建
创建需要1-2分钟，完成后进入Dashboard

## 2. 获取API密钥

1. 在左侧菜单点击"Settings"图标
2. 选择"API"
3. 复制以下信息：
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（保密，不要泄露）

## 3. 创建数据库表

1. 在左侧菜单选择"SQL Editor"
2. 点击"New query"
3. 复制 `supabase/setup.sql` 文件内容
4. 粘贴到SQL编辑器
5. 点击"Run"执行

这会创建三张表：
- `cities` - 城市费率标准
- `salaries` - 员工工资数据
- `calculation_results` - 计算结果

## 4. 配置环境变量

在项目根目录的 `.env.local` 文件中配置：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**重要**：
- 将 `your-project-id` 替换为您的实际项目ID
- 将 `your_anon_key_here` 替换为实际的anon密钥
- 将 `your_service_role_key_here` 替换为实际的服务端密钥

## 5. 重启开发服务器

配置完成后，重启Next.js开发服务器：

```bash
npm run dev
```

## 6. 测试配置

1. 访问 http://localhost:3002/upload
2. 上传 `cities_fixed.xlsx` 文件
3. 上传 `salaries.xlsx` 文件
4. 点击"开始计算"

如果一切正常，数据将被保存到Supabase数据库中。

## 常见问题

### Q: 出现"缺少Supabase环境变量"错误
A: 确保 `.env.local` 文件存在且包含正确的环境变量

### Q: 数据库连接失败
A: 检查API密钥是否正确，项目URL是否正确

### Q: SQL执行失败
A: 确保您有项目权限，SQL语法正确

### Q: 上传数据失败
A: 检查Supabase项目的RLS策略是否正确配置

## 安全注意事项

1. **service_role_key** 是敏感信息，只能在服务端使用
2. 不要将服务端密钥提交到版本控制系统
3. 确保只向客户端暴露必要的API权限
4. 定期更换API密钥

## 备份数据

定期备份您的Supabase数据：
1. 在Dashboard中进入"Settings" > "Database"
2. 使用"Backups"功能创建备份
3. 或使用pg_dump命令手动备份