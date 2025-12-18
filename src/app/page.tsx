import Link from 'next/link'
import { FileUp, Calculator } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">
          五险一金计算器
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 数据上传卡片 */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/upload">
              <div className="p-8">
                <FileUp className="w-12 h-12 text-blue-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-4">数据上传</h2>
                <p className="text-gray-600 mb-6">
                  上传城市费率和员工薪资Excel文件
                </p>
                <div className="w-full bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition-colors">
                  开始上传
                </div>
              </div>
            </Link>
          </div>

          {/* 查看结果卡片 */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/results">
              <div className="p-8">
                <Calculator className="w-12 h-12 text-green-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-4">计算结果</h2>
                <p className="text-gray-600 mb-6">
                  查看五险一金计算结果和明细
                </p>
                <div className="w-full border-2 border-green-500 text-green-500 py-2 px-4 rounded text-center hover:bg-green-50 transition-colors">
                  查看结果
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}