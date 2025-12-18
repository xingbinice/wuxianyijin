-- 创建城市费率标准表
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  city_name VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  base_min DECIMAL(10,2) NOT NULL,
  base_max DECIMAL(10,2) NOT NULL,
  rate DECIMAL(5,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建员工工资数据表
CREATE TABLE salaries (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  employee_name VARCHAR(100) NOT NULL,
  month DATE NOT NULL,
  salary_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建计算结果表（增强版，包含详细分项）
CREATE TABLE calculation_results (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  employee_name VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  avg_salary DECIMAL(10,2) NOT NULL,
  contribution_base DECIMAL(10,2) NOT NULL,

  -- 个人缴纳部分
  personal_pension DECIMAL(10,2) NOT NULL,      -- 养老保险
  personal_medical DECIMAL(10,2) NOT NULL,      -- 医疗保险
  personal_unemployment DECIMAL(10,2) NOT NULL, -- 失业保险
  personal_housing_fund DECIMAL(10,2) NOT NULL, -- 住房公积金

  -- 公司缴纳部分
  company_pension DECIMAL(10,2) NOT NULL,       -- 养老保险
  company_medical DECIMAL(10,2) NOT NULL,       -- 医疗保险
  company_unemployment DECIMAL(10,2) NOT NULL,  -- 失业保险
  company_injury DECIMAL(10,2) NOT NULL,        -- 工伤保险
  company_maternity DECIMAL(10,2) NOT NULL,     -- 生育保险
  company_housing_fund DECIMAL(10,2) NOT NULL,  -- 住房公积金

  -- 总计
  total_personal_fee DECIMAL(10,2) NOT NULL,    -- 个人总费用
  total_company_fee DECIMAL(10,2) NOT NULL,     -- 公司总费用
  net_salary DECIMAL(10,2) NOT NULL,            -- 净工资

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX idx_cities_city_year ON cities(city_name, year);
CREATE INDEX idx_salaries_employee_year ON salaries(employee_id, month);
CREATE INDEX idx_calculation_results_employee_year ON calculation_results(employee_id, year);

-- 创建更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间戳触发器
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON cities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salaries_updated_at BEFORE UPDATE ON salaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculation_results_updated_at BEFORE UPDATE ON calculation_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用Row Level Security (RLS)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_results ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有用户读取（公开访问）
CREATE POLICY "Enable read access for all users on cities" ON cities
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users on salaries" ON salaries
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users on calculation_results" ON calculation_results
  FOR SELECT USING (true);

-- 创建策略：允许所有用户插入（公开上传）
CREATE POLICY "Enable insert for all users on cities" ON cities
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all users on salaries" ON salaries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all users on calculation_results" ON calculation_results
  FOR INSERT WITH CHECK (true);

-- 创建策略：允许所有用户更新自己的数据
CREATE POLICY "Enable update for all users on cities" ON cities
  FOR UPDATE USING (true);

CREATE POLICY "Enable update for all users on salaries" ON salaries
  FOR UPDATE USING (true);

CREATE POLICY "Enable update for all users on calculation_results" ON calculation_results
  FOR UPDATE USING (true);

-- 创建策略：允许所有用户删除数据
CREATE POLICY "Enable delete for all users on cities" ON cities
  FOR DELETE USING (true);

CREATE POLICY "Enable delete for all users on salaries" ON salaries
  FOR DELETE USING (true);

CREATE POLICY "Enable delete for all users on calculation_results" ON calculation_results
  FOR DELETE USING (true);