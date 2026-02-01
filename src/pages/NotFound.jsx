import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-20 mt-16">
        <div className="text-center max-w-md">
          <h1 className="text-8xl font-black text-amber-500 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.<br />
            URL을 다시 확인해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-full transition-colors"
            >
              홈으로 가기
            </a>
            <a
              href="tel:010-6461-0131"
              className="inline-block bg-stone-800 hover:bg-stone-900 text-white font-bold px-8 py-4 rounded-full transition-colors"
            >
              전화 상담
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
