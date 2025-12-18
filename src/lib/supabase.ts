import { createClient } from '@supabase/supabase-js'

// 确保环境变量存在
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少Supabase环境变量。请检查.env.local文件。')
}

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 辅助函数：处理Supabase错误
export const handleSupabaseError = (error: any) => {
  console.error('Supabase错误:', error)
  return error?.message || '数据库操作失败'
}

// 类型定义
export interface CityData {
  id?: number
  city_name: string
  year: number
  base_min: number
  base_max: number
  rate: number
  created_at?: string
  updated_at?: string
}

export interface SalaryData {
  id?: number
  employee_id: string
  employee_name: string
  month: string
  salary_amount: number
  created_at?: string
  updated_at?: string
}

export interface CalculationResult {
  id?: number
  employee_id: string
  employee_name: string
  year: number
  avg_salary: number
  contribution_base: number
  personal_pension: number
  personal_medical: number
  personal_unemployment: number
  personal_housing_fund: number
  company_pension: number
  company_medical: number
  company_unemployment: number
  company_injury: number
  company_maternity: number
  company_housing_fund: number
  total_personal_fee: number
  total_company_fee: number
  net_salary: number
  created_at?: string
  updated_at?: string
}