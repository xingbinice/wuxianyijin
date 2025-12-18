import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { supabase, handleSupabaseError, SalaryData } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '未找到文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '请上传Excel文件（.xlsx或.xls）' },
        { status: 400 }
      )
    }

    // 读取Excel文件
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    // 数据验证和转换
    const validatedData = data.map((row: any) => {
      // 处理字段名映射
      const employee_id = row.employee_id || row['员工工号'] || row.id
      const employee_name = row.employee_name || row['员工姓名']
      const month = row.month || row['月份']
      const salary_amount = row.salary_amount || row['工资金额']

      if (!employee_id || !employee_name || !month || !salary_amount) {
        throw new Error(`数据格式错误：缺少必要字段`)
      }

    // 将YYYYMM格式的月份转换为YYYY-MM-DD格式
    const monthStr = String(month).trim()
    const formattedMonth = `${monthStr.slice(0, 4)}-${monthStr.slice(4, 6)}-01`

    return {
        employee_id: String(employee_id).trim(),
        employee_name: String(employee_name).trim(),
        month: formattedMonth,
        salary_amount: Number(salary_amount)
      }
    })

    // 额外的数据验证
    for (const item of validatedData) {
      // 验证日期格式 YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.month)) {
        throw new Error(`月份格式错误：${item.month}，应为YYYY-MM-DD格式`)
      }
      if (item.salary_amount < 0) {
        throw new Error(`工资金额不能为负数`)
      }
      if (item.salary_amount > 10000000) {
        throw new Error(`工资金额超出合理范围`)
      }
    }

    // 插入到Supabase
    const { data: insertedData, error } = await supabase
      .from('salaries')
      .insert(validatedData)
      .select()

    if (error) {
      throw new Error(handleSupabaseError(error))
    }

    return NextResponse.json({
      success: true,
      message: `成功导入 ${validatedData.length} 条员工薪资数据`,
      count: validatedData.length,
      data: insertedData
    })

  } catch (error: any) {
    console.error('上传薪资数据错误：', error)
    return NextResponse.json(
      { error: error.message || '文件处理失败' },
      { status: 500 }
    )
  }
}