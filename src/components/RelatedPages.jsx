import { getRelatedPages } from '../data/navigation'

export default function RelatedPages({ currentSlug }) {
  const relatedPages = getRelatedPages(currentSlug)

  if (relatedPages.length === 0) return null

  return (
    <section className="bg-stone-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-stone-800 mb-6 text-center">
          관련 페이지
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedPages.map((page, index) => (
            <a
              key={index}
              href={page.url}
              className="group block bg-white border border-stone-200 rounded-xl p-6 hover:border-amber-400 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-bold text-stone-800 group-hover:text-amber-600 transition-colors mb-2">
                {page.h1}
              </h3>
              <p className="text-sm text-stone-500">
                {getPageDescription(page.slug)}
              </p>
              <span className="inline-flex items-center text-amber-600 text-sm font-medium mt-4 group-hover:translate-x-1 transition-transform">
                자세히 보기
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// 페이지별 설명 텍스트
function getPageDescription(slug) {
  const descriptions = {
    faq: '줄눈시공 관련 자주 묻는 질문 10가지를 정리했습니다.',
    types: '케라폭시, 폴리우레아 등 6가지 줄눈 종류를 비교합니다.',
    bathroom: '화장실 줄눈시공의 모든 것을 알려드립니다.',
    price: '투명한 정찰제 가격을 확인하세요.',
    review: '실제 고객들의 생생한 시공 후기입니다.',
    'self-diy': '셀프 시공과 전문업체 시공을 비교해보세요.',
    find: '좋은 줄눈시공 업체를 선택하는 방법을 알려드립니다.'
  }
  return descriptions[slug] || ''
}
