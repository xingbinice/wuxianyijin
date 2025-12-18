import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient, handleSupabaseError, CityData, SalaryData, CalculationResult } from '@/lib/supabase'

// 五险一金费率配置
const INSURANCE_RATES = {
  pension: { personal: 0.08, company: 0.16 },      // 养老保险
  medical: { personal: 0.02, company: 0.10 },       // 医疗保险
  unemployment: { personal: 0.005, company: 0.008 }, // 失业保险
  injury: { personal: 0, company: 0.004 },          // 工伤保险
  maternity: { personal: 0, company: 0.008 },        // 生育保险
  housingFund: { personal: 0.07, company: 0.07 }    // 住房公积金
}

export async function POST(request: NextRequest) {
  try {
    // 获取Supabase客户端
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        { error: '数据库未配置，请联系管理员' },
        { status: 500 }
      )
    }

    // 从Supabase获取数据
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .limit(1) // 暂时取第一条记录

    if (citiesError) {
      throw new Error(handleSupabaseError(citiesError))
    }

    if (!cities || cities.length === 0) {
      throw new Error('未找到城市费率数据，请先上传城市数据')
    }

    const cityData = cities[0]

    // 获取薪资数据
    const { data: salaryData, error: salaryError } = await supabase
      .from('salaries')
      .select('*')

    if (salaryError) {
      throw new Error(handleSupabaseError(salaryError))
    }

    if (!salaryData || salaryData.length === 0) {
      throw new Error('未找到薪资数据，请先上传薪资数据')
    }

    // 按员工分组
    interface GroupedSalaryData {
      employee_id: string
      employee_name: string
      salaries: number[]
    }

    const groupedSalaries = salaryData.reduce((acc: Record<string, GroupedSalaryData>, salary) => {
      const key = salary.employee_id
      if (!acc[key]) {
        acc[key] = {
          employee_id: salary.employee_id,
          employee_name: salary.employee_name,
          salaries: []
        }
      }
      acc[key].salaries.push(salary.salary_amount)
      return acc
    }, {})

    // 计算每个员工的五险一金
    const results = []
    for (const [employeeId, employeeData] of Object.entries(groupedSalaries)) {
      const { employee_name, salaries } = employeeData

      // 计算年度月平均工资
      const avgSalary = salaries.reduce((sum: number, salary: number) => sum + salary, 0) / salaries.length

      // 确定缴费基数
      const contributionBase = Math.max(
        cityData.base_min,
        Math.min(avgSalary, cityData.base_max)
      )

      // 计算各项费用
      const personalFees = {
        pension: contributionBase * INSURANCE_RATES.pension.personal,
        medical: contributionBase * INSURANCE_RATES.medical.personal,
        unemployment: contributionBase * INSURANCE_RATES.unemployment.personal,
        housingFund: contributionBase * INSURANCE_RATES.housingFund.personal,
      }

      const companyFees = {
        pension: contributionBase * INSURANCE_RATES.pension.company,
        medical: contributionBase * INSURANCE_RATES.medical.company,
        unemployment: contributionBase * INSURANCE_RATES.unemployment.company,
        injury: contributionBase * INSURANCE_RATES.injury.company,
        maternity: contributionBase * INSURANCE_RATES.maternity.company,
        housingFund: contributionBase * INSURANCE_RATES.housingFund.company,
      }

      // 计算总额
      const totalPersonalFee = Object.values(personalFees).reduce((sum, fee) => sum + fee, 0)
      const totalCompanyFee = Object.values(companyFees).reduce((sum, fee) => sum + fee, 0)
      const netSalary = avgSalary - totalPersonalFee

      results.push({
        employee_id: employeeId,
        employee_name: employee_name,
        year: cityData.year,
        avg_salary: Math.round(avgSalary * 100) / 100,
        contribution_base: Math.round(contributionBase * 100) / 100,
        personal_pension: Math.round(personalFees.pension * 100) / 100,
        personal_medical: Math.round(personalFees.medical * 100) / 100,
        personal_unemployment: Math.round(personalFees.unemployment * 100) / 100,
        personal_housing_fund: Math.round(personalFees.housingFund * 100) / 100,
        company_pension: Math.round(companyFees.pension * 100) / 100,
        company_medical: Math.round(companyFees.medical * 100) / 100,
        company_unemployment: Math.round(companyFees.unemployment * 100) / 100,
        company_injury: Math.round(companyFees.injury * 100) / 100,
        company_maternity: Math.round(companyFees.maternity * 100) / 100,
        company_housing_fund: Math.round(companyFees.housingFund * 100) / 100,
        total_personal_fee: Math.round(totalPersonalFee * 100) / 100,
        total_company_fee: Math.round(totalCompanyFee * 100) / 100,
        net_salary: Math.round(netSalary * 100) / 100
      })
    }

  // 保存结果到Supabase
    const { data: savedResults, error: saveError } = await supabase
      .from('calculation_results')
      .insert(results)
      .select()

    if (saveError) {
      throw new Error(handleSupabaseError(saveError))
    }

    return NextResponse.json({
      success: true,
      message: `计算完成，处理了 ${results.length} 位员工的数据`,
      count: results.length,
      results: savedResults
    })

  } catch (error: any) {
    console.error('计算错误：', error)
    return NextResponse.json(
      { error: error.message || '计算失败' },
      { status: 500 }
    )
  }
}