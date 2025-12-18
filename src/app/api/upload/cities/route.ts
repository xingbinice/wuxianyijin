import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { supabase, handleSupabaseError, CityData } from '@/lib/supabase'

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
      const city_name = row.city_name || row.city_namte || row['城市名称']
      const year = row.year || row['年份']
      const base_min = row.base_min || row['基数下限']
      const base_max = row.base_max || row['基数上限']
      const rate = row.rate || row['费率']

      if (!city_name || !year || !base_min || !base_max || !rate) {
        throw new Error(`数据格式错误：缺少必要字段`)
      }

      return {
        city_name: String(city_name).trim(),
        year: Number(year),
        base_min: Number(base_min),
        base_max: Number(base_max),
        rate: Number(rate)
      }
    })

    // 额外的数据验证
    for (const item of validatedData) {
      if (item.year < 2000 || item.year > 2100) {
        throw new Error(`年份 ${item.year} 不在有效范围内`)
      }
      if (item.base_min < 0 || item.base_max < 0) {
        throw new Error(`基数不能为负数`)
      }
      if (item.base_min > item.base_max) {
        throw new Error(`基数下限不能大于上限`)
      }
      if (item.rate < 0 || item.rate > 1) {
        throw new Error(`费率必须在0-1之间`)
      }
    }

    // 检查Supabase客户端是否可用
    if (!supabase) {
      return NextResponse.json(
        { error: '数据库未配置，请联系管理员' },
        { status: 500 }
      )
    }

    // 插入到Supabase
    const { data: insertedData, error } = await supabase
      .from('cities')
      .insert(validatedData)
      .select()

    if (error) {
      throw new Error(handleSupabaseError(error))
    }

    return NextResponse.json({
      success: true,
      message: `成功导入 ${validatedData.length} 条城市费率数据`,
      count: validatedData.length,
      data: insertedData
    })

  } catch (error: any) {
    console.error('上传城市数据错误：', error)
    return NextResponse.json(
      { error: error.message || '文件处理失败' },
      { status: 500 }
    )
  }
}