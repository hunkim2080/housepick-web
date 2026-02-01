// 네비게이션 메뉴 데이터
export const mainNav = [
  { name: '홈', url: '/' },
  {
    name: '서비스 안내',
    children: [
      { name: '줄눈 종류', url: '/types', description: '케라폭시, 폴리우레아 등 6가지 줄눈 비교' },
      { name: '화장실 줄눈', url: '/bathroom', description: '화장실 줄눈시공 완벽 가이드' },
      { name: '가격표', url: '/price', description: '정찰제 줄눈시공 비용 안내' },
      { name: '셀프 vs 업체', url: '/self-diy', description: '셀프시공과 전문업체 비교' }
    ]
  },
  {
    name: '고객 후기',
    children: [
      { name: '시공 후기', url: '/review', description: '실제 고객 시공 사례와 후기' }
    ]
  },
  { name: 'FAQ', url: '/faq' },
  { name: '업체 선택법', url: '/find' }
]

// Footer 지역 링크 (주요 10개 지역)
export const footerRegions = [
  { name: '강남', slug: 'gangnam' },
  { name: '송파', slug: 'songpa' },
  { name: '서초', slug: 'seocho' },
  { name: '강동', slug: 'gangdong' },
  { name: '성남', slug: 'seongnam' },
  { name: '용인', slug: 'yongin' },
  { name: '수원', slug: 'suwon' },
  { name: '화성', slug: 'hwaseong' },
  { name: '안양', slug: 'anyang' },
  { name: '부천', slug: 'bucheon' }
]

// Footer 서비스 링크
export const footerServices = [
  { name: '줄눈 종류', url: '/types' },
  { name: '화장실 줄눈', url: '/bathroom' },
  { name: '가격표', url: '/price' },
  { name: '셀프 vs 업체', url: '/self-diy' },
  { name: 'FAQ', url: '/faq' },
  { name: '고객 후기', url: '/review' },
  { name: '업체 선택법', url: '/find' }
]

// 관련 페이지 매핑
export const relatedPagesMap = {
  faq: ['types', 'price', 'review'],
  types: ['bathroom', 'price', 'self-diy'],
  bathroom: ['types', 'price', 'review'],
  price: ['faq', 'bathroom', 'types'],
  review: ['bathroom', 'find', 'faq'],
  'self-diy': ['find', 'types', 'price'],
  find: ['review', 'price', 'faq']
}

// 서비스 페이지 메타 정보 (Breadcrumb, RelatedPages에서 사용)
export const servicePagesMeta = {
  faq: { title: 'FAQ', h1: '자주 묻는 질문', category: null },
  types: { title: '줄눈 종류', h1: '줄눈 종류 비교', category: '서비스 안내' },
  bathroom: { title: '화장실 줄눈', h1: '화장실 줄눈시공', category: '서비스 안내' },
  price: { title: '가격표', h1: '줄눈시공 가격표', category: '서비스 안내' },
  review: { title: '고객 후기', h1: '시공 후기', category: '고객 후기' },
  'self-diy': { title: '셀프 vs 업체', h1: '셀프 vs 전문업체', category: '서비스 안내' },
  find: { title: '업체 선택법', h1: '업체 선택 가이드', category: null }
}

// Breadcrumb 아이템 생성 함수
export function getBreadcrumbItems(slug, regionName = null) {
  const baseUrl = 'https://housepick-web.vercel.app'

  // 지역 페이지인 경우
  if (regionName) {
    return [
      { name: '홈', url: baseUrl + '/' },
      { name: `${regionName} 줄눈시공`, url: baseUrl + '/' + slug }
    ]
  }

  // 서비스 페이지인 경우
  const meta = servicePagesMeta[slug]
  if (!meta) return [{ name: '홈', url: baseUrl + '/' }]

  const items = [{ name: '홈', url: baseUrl + '/' }]

  // 카테고리가 있으면 중간 단계 추가
  if (meta.category) {
    // 카테고리 대표 페이지 URL
    const categoryUrl = meta.category === '서비스 안내' ? '/types' : '/review'
    items.push({ name: meta.category, url: baseUrl + categoryUrl })
  }

  items.push({ name: meta.h1, url: baseUrl + '/' + slug })

  return items
}

// 관련 페이지 정보 가져오기
export function getRelatedPages(currentSlug) {
  const relatedSlugs = relatedPagesMap[currentSlug] || []
  return relatedSlugs.map(slug => ({
    slug,
    ...servicePagesMeta[slug],
    url: '/' + slug
  }))
}
