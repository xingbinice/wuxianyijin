'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function UploadPage() {
  const [citiesUploaded, setCitiesUploaded] = useState(false)
  const [salariesUploaded, setSalariesUploaded] = useState(false)
  const [uploading, setUploading] = useState('')
  const [message, setMessage] = useState('')

  const handleFileUpload = async (file: File, type: 'cities' | 'salaries') => {
    if (!file) return

    // 验证文件类型
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]

    if (!allowedTypes.includes(file.type)) {
      setMessage('请上传Excel文件（.xlsx或.xls）')
      return
    }

    // 验证文件大小（5MB限制）
    if (file.size > 5 * 1024 * 1024) {
      setMessage('文件大小不能超过5MB')
      return
    }

    setUploading(type)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/upload/${type}`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(`成功上传${type === 'cities' ? '城市费率' : '员工薪资'}数据`)
        if (type === 'cities') {
          setCitiesUploaded(true)
        } else {
          setSalariesUploaded(true)
        }
      } else {
        setMessage(result.error || `上传${type === 'cities' ? '城市费率' : '员工薪资'}数据失败`)
      }
    } catch (error) {
      setMessage('网络错误，请重试')
    } finally {
      setUploading('')
    }
  }

  const handleCalculate = async () => {
    if (!citiesUploaded || !salariesUploaded) {
      setMessage('请先上传所有数据文件')
      return
    }

    setUploading('calculate')
    setMessage('正在计算...')

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage(`计算完成！已处理${result.count || 0}条数据`)
      } else {
        setMessage(result.error || '计算失败')
      }
    } catch (error) {
      setMessage('计算过程中出现错误，请重试')
    } finally {
      setUploading('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* 返回主页链接 */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回主页
        </Link>

        <h1 className="text-3xl font-bold mb-8">数据上传</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.includes('成功') || message.includes('完成')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {message.includes('成功') || message.includes('完成') ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message}
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-8">
          {/* 城市费率上传 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">城市费率数据</h2>
              <p className="text-gray-600 mb-4">
                上传城市费率Excel文件，包含城市名称、年份、缴费基数上下限和费率
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-800">
                    {citiesUploaded ? '重新上传文件' : '选择文件'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'cities')
                    }}
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">支持 .xlsx 和 .xls 格式</p>
              </div>

              {citiesUploaded && (
                <div className="mt-4 flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  已上传城市费率数据
                </div>
              )}
            </div>
          </div>

          {/* 薪资数据上传 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">员工薪资数据</h2>
              <p className="text-gray-600 mb-4">
                上传员工薪资Excel文件，包含员工ID、姓名、月份和薪资金额
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-800">
                    {salariesUploaded ? '重新上传文件' : '选择文件'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'salaries')
                    }}
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">支持 .xlsx 和 .xls 格式</p>
              </div>

              {salariesUploaded && (
                <div className="mt-4 flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  已上传员工薪资数据
                </div>
              )}
            </div>
          </div>

          {/* 计算按钮 */}
          <button
            onClick={handleCalculate}
            disabled={!citiesUploaded || !salariesUploaded || uploading !== ''}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              !citiesUploaded || !salariesUploaded || uploading !== ''
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {uploading === 'calculate' ? '计算中...' : '开始计算'}
          </button>

          {/* 查看结果链接 */}
          {citiesUploaded && salariesUploaded && (
            <div className="text-center">
              <Link
                href="/results"
                className="inline-flex items-center text-green-600 hover:text-green-800 font-semibold"
              >
                查看计算结果 →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}