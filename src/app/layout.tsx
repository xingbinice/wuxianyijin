import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '五险一金计算器 - 快速准确的社保计算工具',
  description: '专业的五险一金计算器，支持多城市费率，批量计算员工社保公积金',
  keywords: ['五险一金', '社保计算', '公积金', '工资计算'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}