/**
 * 서비스 페이지 메인 컴포넌트
 * 7개 서비스 페이지 (faq, types, bathroom, price, review, self-diy, find)
 */
import React, { useState, useEffect } from 'react'
import * as ChannelService from '@channel.io/channel-web-sdk-loader'
import { faqData, reviewsData, getAllServices, serviceImages } from '../data/services'
import BeforeAfter from '../components/BeforeAfter'
import OptimizedImage from '../components/OptimizedImage'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Breadcrumb from '../components/Breadcrumb'
import RelatedPages from '../components/RelatedPages'

// 컴포넌트 외부에서 SSG 콘텐츠 즉시 읽기 (hydration 이전)
const getInitialSsgHtml = () => {
  if (typeof document !== 'undefined') {
    const template = document.getElementById('ssg-content-template')
    return template ? template.innerHTML : ''
  }
  return ''
}

// FAQ 아코디언 컴포넌트
function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
          >
            <span className="font-bold text-stone-800 text-lg pr-4">
              Q{idx + 1}. {item.question}
            </span>
            <span className={`text-2xl text-amber-500 transition-transform ${openIndex === idx ? 'rotate-45' : ''}`}>
              +
            </span>
          </button>
          {openIndex === idx && (
            <div className="px-6 pb-5 pt-2 border-t border-stone-100">
              <p className="text-stone-600 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// 리뷰 카드 컴포넌트 (이미지 포함)
function ReviewCard({ review, beforeImage, afterImage }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      {/* Before/After 이미지 */}
      {beforeImage && afterImage && (
        <BeforeAfter
          beforeSrc={beforeImage}
          afterSrc={afterImage}
          beforeAlt={`${review.location} ${review.author} 시공 전`}
          afterAlt={`${review.location} ${review.author} 시공 후`}
          className="mb-4"
        />
      )}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
        <span className="text-stone-400 text-sm">{review.date}</span>
      </div>
      <p className="text-stone-700 mb-4 leading-relaxed">"{review.text}"</p>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full">{review.location}</span>
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{review.space}</span>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">{review.cost}</span>
      </div>
      <p className="text-stone-500 text-sm mt-3">- {review.author}</p>
    </div>
  )
}

// 서비스 페이지 메인 컴포넌트
export default function ServicePage({ service }) {
  const [isVisible, setIsVisible] = useState(true)
  const [showChatBubble, setShowChatBubble] = useState(false)
  const [chatBubbleClosed, setChatBubbleClosed] = useState(false)
  // SSG 콘텐츠를 즉시 초기값으로 설정 (useEffect 대기 없이)
  const [ssgHtml] = useState(getInitialSsgHtml)

  useEffect(() => {
    setIsVisible(true)

    // 채널톡 초기화
    ChannelService.loadScript()
    ChannelService.boot({
      pluginKey: "b59d5b7c-82c0-4e3a-a984-7ec0e37ee354",
      hideChannelButtonOnBoot: true
    })

    // 스크롤 시 채팅 팝업 표시/숨김
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowChatBubble(true)
      } else {
        setShowChatBubble(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fadeIn = (delay) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
  })

  // 리뷰 이미지 매핑
  const reviewImageMap = [
    { before: serviceImages.review.review1Before, after: serviceImages.review.review1After },
    { before: serviceImages.review.review2Before, after: serviceImages.review.review2After },
    { before: serviceImages.review.review3Before, after: serviceImages.review.review3After },
  ]

  // 서비스 타입별 내용 렌더링
  const renderContent = () => {
    // SSG 콘텐츠가 있으면 우선 표시
    if (ssgHtml) {
      return (
        <div
          className="ssg-content-wrapper"
          dangerouslySetInnerHTML={{ __html: ssgHtml }}
        />
      )
    }

    // SSG 콘텐츠가 없는 경우 fallback (CSR 모드)
    switch (service.slug) {
      case 'faq':
        return <FAQAccordion items={faqData} />
      case 'bathroom':
        return (
          <div className="space-y-8">
            {/* Before/After 사진 */}
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">화장실 줄눈시공 Before & After</h2>
              <BeforeAfter
                beforeSrc={serviceImages.bathroom.before1}
                afterSrc={serviceImages.bathroom.after1}
                beforeAlt="화장실 줄눈시공 전 - 변색된 백시멘트 상태"
                afterAlt="화장실 줄눈시공 후 - 케라폭시 깔끔한 마감"
              />
            </div>
            <div className="prose prose-lg prose-stone max-w-none">
              <p className="text-lg text-stone-600 leading-relaxed">
                자세한 내용은 상담 버튼을 통해 문의해주세요.
              </p>
            </div>
          </div>
        )
      case 'review':
        return (
          <div className="space-y-6">
            {/* 평점 요약 */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center mb-8">
              <div className="text-5xl font-black text-amber-500 mb-2">4.9</div>
              <div className="text-amber-600 text-lg mb-1">{'★'.repeat(5)}</div>
              <p className="text-stone-600">총 4,200건의 리뷰</p>
            </div>
            {/* 리뷰 목록 (이미지 포함) */}
            <div className="grid md:grid-cols-1 gap-6">
              {reviewsData.map((review, idx) => (
                <ReviewCard
                  key={idx}
                  review={review}
                  beforeImage={reviewImageMap[idx]?.before}
                  afterImage={reviewImageMap[idx]?.after}
                />
              ))}
            </div>
          </div>
        )
      case 'self-diy':
        return (
          <div className="space-y-8">
            {/* 비교 이미지 */}
            <div>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">셀프 vs 전문업체 결과 비교</h2>
              <BeforeAfter
                beforeSrc={serviceImages.selfDiy.selfResult}
                afterSrc={serviceImages.selfDiy.proResult}
                beforeAlt="셀프 줄눈시공 결과 - 일반인 DIY"
                afterAlt="전문업체 줄눈시공 결과 - 하우스Pick"
              />
            </div>
            <div className="prose prose-lg prose-stone max-w-none">
              <p className="text-lg text-stone-600 leading-relaxed">
                자세한 내용은 상담 버튼을 통해 문의해주세요.
              </p>
            </div>
          </div>
        )
      case 'types':
        return (
          <div className="space-y-8">
            {/* 줄눈 종류 대표 이미지 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-stone-200 p-4">
                <OptimizedImage
                  src={serviceImages.types.kerapoxy}
                  alt="케라폭시 줄눈시공 완료 - 화장실 바닥 광택 마감"
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <p className="text-center font-semibold text-stone-700">케라폭시</p>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 p-4">
                <OptimizedImage
                  src={serviceImages.types.polyurea}
                  alt="폴리우레아 줄눈시공 완료 - 현관 바닥"
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <p className="text-center font-semibold text-stone-700">폴리우레아</p>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 p-4">
                <OptimizedImage
                  src={serviceImages.types.ardex}
                  alt="아덱스 줄눈시공 완료 - 욕실 타일"
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <p className="text-center font-semibold text-stone-700">아덱스</p>
              </div>
            </div>
            <div className="prose prose-lg prose-stone max-w-none">
              <p className="text-lg text-stone-600 leading-relaxed">
                자세한 내용은 상담 버튼을 통해 문의해주세요.
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div className="prose prose-lg prose-stone max-w-none">
            <p className="text-lg text-stone-600 leading-relaxed">
              자세한 내용은 아래 상담 버튼을 통해 문의해주세요.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
        * { font-family: 'Noto Sans KR', sans-serif; }
        .btn-primary {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(245, 158, 11, 0.4);
        }
      `}</style>

      {/* 상단 고정 헤더 */}
      <Header />

      {/* 브레드크럼 */}
      <div className="pt-[60px]">
        <Breadcrumb slug={service.slug} />
      </div>

      {/* 플로팅 CTA 버튼 */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {showChatBubble && !chatBubbleClosed && (
          <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg px-4 py-3 mb-1 animate-fade-in">
            <div className="flex -space-x-2 mr-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm">👤</div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">👤</div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-stone-800">궁금한 건 채팅으로 문의하세요</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                몇 분 내 답변 받으실 수 있어요
              </p>
            </div>
            <button
              onClick={() => setChatBubbleClosed(true)}
              className="text-stone-400 hover:text-stone-600 ml-2"
            >
              ✕
            </button>
          </div>
        )}
        <button
          onClick={() => ChannelService.showMessenger()}
          className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110"
          title="채널톡 상담"
        >
          💬
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative text-white pt-28 pb-20 px-6 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div style={fadeIn(0)}>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="text-amber-300 text-sm font-medium tracking-wide">하우스Pick 줄눈시공</span>
            </div>
          </div>

          <h1 style={fadeIn(0.1)} className="text-3xl lg:text-5xl font-bold leading-tight mb-6">
            {service.h1}
          </h1>

          <p style={fadeIn(0.2)} className="text-xl text-stone-300 mb-10">
            {service.subtitle}
          </p>

          <div style={fadeIn(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:010-6461-0131"
              className="btn-primary text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg inline-flex items-center justify-center gap-2"
            >
              <span>📞</span> 전화 상담
            </a>
            <button
              onClick={() => ChannelService.showMessenger()}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              <span>💬</span> 채팅 상담
            </button>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </section>

      {/* 다른 서비스 페이지 링크 */}
      <section className="py-16 px-6 bg-stone-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-800 mb-8 text-center">
            더 알아보기
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getAllServices()
              .filter(s => s.slug !== service.slug)
              .slice(0, 4)
              .map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all border border-stone-200 hover:border-amber-400"
                >
                  <div className="text-2xl mb-2">
                    {s.slug === 'faq' ? '❓' :
                      s.slug === 'types' ? '📋' :
                        s.slug === 'bathroom' ? '🚿' :
                          s.slug === 'price' ? '💰' :
                            s.slug === 'review' ? '⭐' :
                              s.slug === 'self-diy' ? '🔧' :
                                s.slug === 'find' ? '🔍' : '📄'}
                  </div>
                  <p className="text-stone-700 font-medium text-sm">
                    {s.slug === 'faq' ? 'FAQ' :
                      s.slug === 'types' ? '줄눈 종류' :
                        s.slug === 'bathroom' ? '화장실 가이드' :
                          s.slug === 'price' ? '가격표' :
                            s.slug === 'review' ? '후기' :
                              s.slug === 'self-diy' ? '셀프 vs 업체' :
                                s.slug === 'find' ? '업체 선택' : s.slug}
                  </p>
                </a>
              ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">줄눈시공, 지금 상담받으세요</h2>
          <p className="text-white/80 text-lg mb-8">가격도 정찰제, 품질도 5년 보장</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:010-6461-0131"
              className="bg-white text-amber-600 font-bold text-lg px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 hover:bg-stone-100 transition-all"
            >
              <span>📞</span> 010-6461-0131
            </a>
            <button
              onClick={() => ChannelService.showMessenger()}
              className="bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
            >
              <span>💬</span> 채팅 상담
            </button>
          </div>
        </div>
      </section>

      {/* 관련 페이지 */}
      <RelatedPages currentSlug={service.slug} />

      {/* Footer */}
      <Footer />
    </div>
  )
}
