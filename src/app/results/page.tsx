'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, Download } from 'lucide-react'

interface Result {
  id: number
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
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      // 这里应该从Supabase获取结果，暂时使用计算API
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
      } else {
        const errorData = await response.json()
        setError(errorData.error || '获取结果失败')
      }
    } catch (error) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount)
  }

  const exportToExcel = () => {
    // 简单的CSV导出
    const headers = [
      '员工姓名', '员工编号', '年份', '平均工资', '缴费基数',
      '个人养老金', '个人医疗', '个人失业', '个人公积金',
      '公司养老金', '公司医疗', '公司失业', '公司工伤', '公司生育', '公司公积金',
      '个人总费用', '公司总费用', '净工资'
    ]

    const csvContent = [
      headers.join(','),
      ...results.map(r => [
        r.employee_name,
        r.employee_id,
        r.year,
        r.avg_salary,
        r.contribution_base,
        r.personal_pension,
        r.personal_medical,
        r.personal_unemployment,
        r.personal_housing_fund,
        r.company_pension,
        r.company_medical,
        r.company_unemployment,
        r.company_injury,
        r.company_maternity,
        r.company_housing_fund,
        r.total_personal_fee,
        r.total_company_fee,
        r.net_salary
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `五险一金计算结果_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>正在加载计算结果...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchResults}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* 返回主页链接 */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回主页
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">计算结果</h1>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            disabled={results.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            导出Excel
          </button>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无计算结果</h3>
            <p className="text-gray-600 mb-6">
              请先上传城市费率和员工薪资数据，然后进行计算
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
            >
              前往上传
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      员工信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      平均工资
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      缴费基数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      个人费用
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      公司费用
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      净工资
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{result.employee_name}</div>
                          <div className="text-sm text-gray-500">{result.employee_id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(result.avg_salary)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(result.contribution_base)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(result.total_personal_fee)}</div>
                        <div className="text-xs text-gray-500">
                          养老: {formatCurrency(result.personal_pension)} |
                          医疗: {formatCurrency(result.personal_medical)} |
                          公积金: {formatCurrency(result.personal_housing_fund)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(result.total_company_fee)}</div>
                        <div className="text-xs text-gray-500">
                          养老: {formatCurrency(result.company_pension)} |
                          医疗: {formatCurrency(result.company_medical)} |
                          公积金: {formatCurrency(result.company_housing_fund)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{formatCurrency(result.net_salary)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                      合计
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(results.reduce((sum, r) => sum + r.total_personal_fee, 0))}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(results.reduce((sum, r) => sum + r.total_company_fee, 0))}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">
                      {formatCurrency(results.reduce((sum, r) => sum + r.net_salary, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* 统计信息 */}
        {results.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">员工总数</h3>
              <p className="text-3xl font-bold text-blue-600">{results.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">公司总支出</h3>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(results.reduce((sum, r) => sum + r.total_company_fee, 0))}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">净工资总额</h3>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(results.reduce((sum, r) => sum + r.net_salary, 0))}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}