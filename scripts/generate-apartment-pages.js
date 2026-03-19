import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://housepick-web.vercel.app'

// 데이터 로드
const dataPath = path.join(__dirname, '..', 'data')
const apartmentsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'apartments.json'), 'utf-8'))
const settings = JSON.parse(fs.readFileSync(path.join(dataPath, 'settings.json'), 'utf-8'))

// 템플릿 로드
const templatePath = path.join(__dirname, '..', 'templates', 'apartment.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// dist 디렉토리 확인
const distPath = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(distPath)) {
  console.log('dist 폴더가 없습니다. 먼저 npm run build를 실행하세요.')
  process.exit(1)
}

// dist/regional.html에서 빌드된 JS/CSS 경로 추출 (지역 페이지용 엔트리 포인트 재사용)
const regionalHtmlPath = path.join(distPath, 'regional.html')
const regionalHtml = fs.readFileSync(regionalHtmlPath, 'utf-8')

// Vite 빌드 파일 경로 추출 (해시 포함된 파일명)
const jsMatch = regionalHtml.match(/src="(\/assets\/regional-[^"]+\.js)"/)
const cssMatch = regionalHtml.match(/href="(\/assets\/index-[^"]+\.css)"/)

const viteJs = jsMatch ? jsMatch[1] : '/assets/regional.js'
const viteCss = cssMatch ? cssMatch[1] : '/assets/index.css'

console.log(`Vite 빌드 파일 감지: JS=${viteJs}, CSS=${viteCss}`)

// 지역 이름 매핑
const regionNames = {
  seoul: '서울',
  gyeonggi: '경기',
  incheon: '인천'
}

// 지역 slug → 지역 페이지 slug 매핑 (기존 지역 페이지와 연결)
const regionSlugToPageSlug = {
  seoul: 'gangnam',  // 서울은 강남으로 대표
  gyeonggi: 'suwon', // 경기는 수원으로 대표
  incheon: 'incheon' // 인천은 인천으로 대표
}

// aptType 계산 (준공년도 기준) - SEO title용
function getAptType(year) {
  const currentYear = new Date().getFullYear()
  const age = currentYear - year
  if (age <= 10) return 'new'      // 10년 이하 = 신축
  if (age <= 20) return 'mid'      // 11~20년 = 중년차
  return 'old'                      // 21년 이상 = 구축
}

// ========================================
// 콘텐츠 고유성 강화: 5가지 동적 계산 필드
// ========================================

// 1. 난방방식 계산
function getHeating(year) {
  if (year < 2000) return '중앙난방'
  if (year < 2010) return '개별난방(구형)'
  return '개별난방(신형)'
}

// 2. 타일종류 계산 (브랜드 기반)
function getTileType(brand) {
  const tileMap = {
    '삼성물산': '포세린',      // 래미안
    '현대건설': '세라믹',      // 힐스테이트
    'GS건설': '포세린',        // 자이
    '대우건설': '세라믹',      // 푸르지오
    'DL이앤씨': '강화세라믹',  // e편한세상
    '포스코건설': '포세린',    // 더샵
    '롯데건설': '세라믹',      // 롯데캐슬
    'HDC현대산업개발': '포세린' // 아이파크
  }
  return tileMap[brand] || '세라믹'
}

// 3. 단지규모 계산
function getComplexType(households) {
  if (households >= 2000) return '대단지'
  if (households >= 500) return '중형단지'
  return '소형단지'
}

// 4. 경과 개월수 계산
function getAgeMonths(year, month = 6) {
  const now = new Date()
  const completionDate = new Date(year, month - 1) // month는 1-based
  const diffMs = now - completionDate
  const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44))
  return Math.max(0, diffMonths)
}

// 5. 경과 기간 텍스트 계산
function getAgePeriod(ageMonths) {
  if (ageMonths <= 36) {
    return `${ageMonths}개월`
  }
  if (ageMonths <= 84) {
    const years = Math.floor(ageMonths / 12)
    const months = ageMonths % 12
    return months > 0 ? `${years}년 ${months}개월` : `${years}년`
  }
  const years = Math.floor(ageMonths / 12)
  return `${years}년`
}

// 핵심 분석 문구 생성 (아파트마다 전부 다르게)
function generateAnalysis(apt) {
  const heating = getHeating(apt.year)
  const tileType = getTileType(apt.brand)
  const complexType = getComplexType(apt.households)
  const ageMonths = getAgeMonths(apt.year, apt.month)
  const agePeriod = getAgePeriod(ageMonths)

  // 난방방식별 특성
  const heatingNote = {
    '중앙난방': '중앙난방 방식으로 계절별 온도 편차가 커 줄눈 수축·팽창이 반복됩니다',
    '개별난방(구형)': '개별난방이지만 구형 보일러 특성상 욕실 바닥 온도가 불균일한 편입니다',
    '개별난방(신형)': '개별난방 방식으로 욕실 온도 조절이 자유롭지만 줄눈 주변 습기 관리가 중요합니다'
  }[heating]

  // 타일종류별 특성
  const tileNote = {
    '포세린': '포세린 타일은 줄눈 폭이 좁아 오염 침투 속도가 일반 타일 대비 1.5배 빠릅니다',
    '세라믹': '세라믹 타일은 흡수율이 높아 줄눈에 수분이 스며들면 곰팡이 번식 속도가 빠릅니다',
    '강화세라믹': '강화세라믹 타일은 표면이 단단하지만 줄눈 경계면이 취약해 정기 관리가 필요합니다'
  }[tileType]

  // 경과기간별 진단
  const ageNote = (() => {
    if (ageMonths <= 36) {
      return `준공 ${agePeriod} 시점으로, 입주 초기 줄눈 코팅으로 오염을 원천 차단할 적기입니다`
    }
    if (ageMonths <= 84) {
      return `${agePeriod} 경과 시점으로, 줄눈 변색이 시작되는 평균 구간(5~7년)에 해당해 재시공 적기입니다`
    }
    return `${agePeriod} 경과로, 줄눈 내부 곰팡이 포자가 깊숙이 침투했을 가능성이 높아 전면 재시공을 권장합니다`
  })()

  return `${apt.name}(준공 ${agePeriod}, ${apt.households.toLocaleString()}세대 ${complexType})은 ${heatingNote}. ${tileNote}. ${ageNote}.`
}

// 세대수 기반 단지 특성 문구 생성
function getComplexNote(apt) {
  const complexType = getComplexType(apt.households)

  if (complexType === '대단지') {
    return `${apt.households.toLocaleString()}세대 대단지 특성상 동별 배관 노후화 속도가 다를 수 있어, 입주 연차가 같아도 동마다 줄눈 상태가 다릅니다. 세대별 맞춤 진단을 권장합니다.`
  }
  if (complexType === '중형단지') {
    return `${apt.households.toLocaleString()}세대 규모로 관리비 효율이 높은 단지입니다. 공용부 청결도가 높은 단지일수록 세대 내 욕실 관리 의식도 높아, 이웃 세대와 함께 줄눈시공 시 할인 혜택이 가능합니다.`
  }
  return `${apt.households.toLocaleString()}세대 소형 단지로, 관리사무소 통한 일괄 예약보다 개별 문의가 빠릅니다. 소규모 단지는 시공 일정 조율이 유연해 원하는 날짜에 시공받기 수월합니다.`
}

// [DEPRECATED] 기존 메시지 시스템은 generateAnalysis()와 getComplexNote()로 대체됨

// title 패턴 (aptType별 차별화)
function getTitle(apt) {
  const type = getAptType(apt.year)
  if (type === 'new') return `${apt.name} 입주청소 줄눈시공 | 하우스픽`
  if (type === 'mid') return `${apt.name} 줄눈시공 전문업체 | 하우스픽`
  return `${apt.name} 줄눈 곰팡이 제거 재시공 | 하우스픽`
}

// Meta description 생성
function getMetaDescription(apt, districtName) {
  return `${districtName} ${apt.name} 케라폭시 줄눈시공 전문 하우스픽. ${apt.households}세대 아파트. 현장 출장 무료견적, 당일 시공 가능. 5년 무상 A/S 보장.`
}

// JSON-LD 3종 세트 생성
function getJsonLd(apt, districtName, regionSlug, districtSlug) {
  const canonicalUrl = `${BASE_URL}/${regionSlug}/${districtSlug}/${apt.slug}`

  return JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `${apt.name} 케라폭시 줄눈시공`,
      "description": `${districtName} ${apt.name} 아파트 케라폭시 줄눈시공 전문 서비스`,
      "provider": {
        "@type": "LocalBusiness",
        "name": "하우스픽",
        "telephone": "010-6461-0131",
        "areaServed": districtName,
        "url": BASE_URL
      },
      "serviceType": "줄눈시공",
      "areaServed": {
        "@type": "Place",
        "name": `${districtName} ${apt.name}`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `${apt.name} 줄눈시공 비용은 얼마인가요?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "욕실 1개 기준 15~25만원이며, 무료 현장 방문 후 정확한 금액을 안내드립니다."
          }
        },
        {
          "@type": "Question",
          "name": `${apt.name} 줄눈시공 기간은 얼마나 걸리나요?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "욕실 1개 기준 약 2~3시간이며, 당일 시공 완료됩니다."
          }
        },
        {
          "@type": "Question",
          "name": `${apt.name} 입주 전후 언제 시공하는 게 좋을까요?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "입주 전 시공을 권장합니다. 가구 배치 전에 시공하면 더 깔끔한 마감이 가능합니다."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "홈",
          "item": `${BASE_URL}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": regionNames[regionSlug],
          "item": `${BASE_URL}/${regionSlugToPageSlug[regionSlug]}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${apt.name} 줄눈시공`,
          "item": canonicalUrl
        }
      ]
    }
  ], null, 2)
}

// Sitemap 포함 여부 결정 함수
function shouldIncludeInSitemap(apt) {
  if (!apt.isUpcoming) {
    // 기존 아파트: phase 기준 유지
    return apt.phase <= settings.currentPhase
  } else {
    // 입주예정 아파트: 입주 3개월 전부터 자동 노출
    if (!apt.recentMoveIn) return false
    const moveInDate = new Date(apt.recentMoveIn.year, apt.recentMoveIn.month - 1)
    const threeMonthsBefore = new Date(moveInDate)
    threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - 3)
    return new Date() >= threeMonthsBefore
  }
}

// 입주예정 배지 HTML 생성
function getUpcomingBadgeHtml(apt) {
  if (!apt.isUpcoming || !apt.recentMoveIn) return ''
  return `<div class="apt-upcoming-badge">🏗️ ${apt.recentMoveIn.year}년 ${apt.recentMoveIn.month}월 입주 예정 · 지금 예약하면 입주 당일 시공 가능</div>`
}

// CTA 문구 생성
function getCtaText(apt) {
  if (apt.isUpcoming) {
    return '입주 전 줄눈시공 예약하기'
  }
  return '무료 견적 신청'
}

// 메인 생성 로직
console.log(`\n아파트 페이지 생성 시작...`)
console.log(`현재 Phase: ${settings.currentPhase}`)
console.log(`현재 날짜: ${new Date().toISOString().split('T')[0]}`)

let generatedCount = 0
let upcomingCount = 0
let upcomingInSitemapCount = 0
const sitemapUrls = []

for (const [regionSlug, districts] of Object.entries(apartmentsData)) {
  for (const [districtSlug, districtData] of Object.entries(districts)) {
    const districtName = districtData.name
    const regionName = regionNames[regionSlug] || regionSlug

    for (const apt of districtData.apartments) {
      const aptType = getAptType(apt.year)
      const title = getTitle(apt)
      const description = getMetaDescription(apt, districtName)
      const canonicalUrl = `${BASE_URL}/${regionSlug}/${districtSlug}/${apt.slug}`

      // 입주예정 카운트
      if (apt.isUpcoming) upcomingCount++

      // 인근 아파트 크로스링킹 (같은 district, 자기 자신 제외, 최대 5개)
      const nearbyApts = districtData.apartments
        .filter(a => a.slug !== apt.slug)
        .slice(0, 5)
      const nearbyHtml = nearbyApts.length > 0
        ? nearbyApts.map(a =>
            `            <a href="/${regionSlug}/${districtSlug}/${a.slug}">${a.name} 줄눈시공</a>`
          ).join('\n')
        : `            <a href="/${regionSlugToPageSlug[regionSlug]}">${regionName} 전체 지역 보기</a>`

      // 콘텐츠 고유성 강화: 동적 계산 기반 문구 생성
      const analysisMsg = generateAnalysis(apt)
      const complexNote = getComplexNote(apt)

      // 입주예정 관련 치환
      const upcomingBadgeHtml = getUpcomingBadgeHtml(apt)
      const ctaText = getCtaText(apt)

      let html = template
        .replace(/\{\{TITLE\}\}/g, title)
        .replace(/\{\{META_DESCRIPTION\}\}/g, description)
        .replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl)
        .replace(/\{\{VITE_JS\}\}/g, viteJs)
        .replace(/\{\{VITE_CSS\}\}/g, viteCss)
        .replace(/\{\{REGION\}\}/g, regionSlugToPageSlug[regionSlug])
        .replace(/\{\{REGION_NAME\}\}/g, regionName)
        .replace(/\{\{DISTRICT\}\}/g, districtSlug)
        .replace(/\{\{DISTRICT_NAME\}\}/g, districtName)
        .replace(/\{\{APT_SLUG\}\}/g, apt.slug)
        .replace(/\{\{APT_NAME\}\}/g, apt.name)
        .replace(/\{\{APT_YEAR\}\}/g, apt.year)
        .replace(/\{\{APT_HOUSEHOLDS\}\}/g, apt.households.toLocaleString())
        .replace(/\{\{APT_BRAND\}\}/g, apt.brand || '기타')
        .replace(/\{\{ANALYSIS_MESSAGE\}\}/g, analysisMsg)
        .replace(/\{\{COMPLEX_NOTE\}\}/g, complexNote)
        .replace(/\{\{NEARBY_APTS_HTML\}\}/g, nearbyHtml)
        .replace(/\{\{JSON_LD\}\}/g, getJsonLd(apt, districtName, regionSlug, districtSlug))
        .replace(/\{\{UPCOMING_BADGE\}\}/g, upcomingBadgeHtml)
        .replace(/\{\{CTA_TEXT\}\}/g, ctaText)

      // dist 폴더에 저장: dist/{region}/{district}/{apt-slug}/index.html
      const outputDir = path.join(distPath, regionSlug, districtSlug, apt.slug)
      fs.mkdirSync(outputDir, { recursive: true })
      fs.writeFileSync(path.join(outputDir, 'index.html'), html)

      generatedCount++

      // Sitemap 포함 여부 결정 (기존 + 입주예정 통합)
      if (shouldIncludeInSitemap(apt)) {
        sitemapUrls.push({
          url: canonicalUrl,
          priority: apt.isUpcoming ? '0.8' : (apt.phase === 1 ? '0.7' : '0.6')
        })
        if (apt.isUpcoming) upcomingInSitemapCount++
      }

      // 진행 상황 표시 (100개마다)
      if (generatedCount % 100 === 0) {
        console.log(`  ... ${generatedCount}개 생성됨`)
      }
    }
  }
}

console.log(`\n✅ 아파트 페이지 생성 완료: ${generatedCount}개`)
console.log(`📍 Sitemap 포함 (Phase ${settings.currentPhase} 이하): ${sitemapUrls.length}개`)

// 기존 sitemap.xml에 아파트 URL 추가
const existingSitemapPath = path.join(distPath, 'sitemap.xml')
if (fs.existsSync(existingSitemapPath)) {
  let sitemap = fs.readFileSync(existingSitemapPath, 'utf-8')
  const today = new Date().toISOString().split('T')[0]

  // 아파트 URL 생성
  const apartmentUrlsXml = sitemapUrls.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')

  // </urlset> 앞에 아파트 URL 삽입
  sitemap = sitemap.replace('</urlset>', `${apartmentUrlsXml}\n</urlset>`)

  fs.writeFileSync(existingSitemapPath, sitemap)
  console.log(`\n✅ sitemap.xml 업데이트 완료 (아파트 ${sitemapUrls.length}개 URL 추가)`)
} else {
  console.log(`\n⚠️ sitemap.xml을 찾을 수 없습니다. generate-regional-pages.js가 먼저 실행되어야 합니다.`)
}

// 결과 요약
const existingInSitemap = sitemapUrls.length - upcomingInSitemapCount
console.log(`\n========================================`)
console.log(`📊 생성 결과 요약`)
console.log(`========================================`)
console.log(`총 아파트 페이지: ${generatedCount}개`)
console.log(`  - 기존 아파트: ${generatedCount - upcomingCount}개`)
console.log(`  - 입주예정 아파트: ${upcomingCount}개`)
console.log(`----------------------------------------`)
console.log(`Sitemap 포함: ${sitemapUrls.length}개`)
console.log(`  - 기존 (Phase ${settings.currentPhase} 이하): ${existingInSitemap}개`)
console.log(`  - 입주예정 (3개월 이내): ${upcomingInSitemapCount}개`)
console.log(`Sitemap 미포함: ${generatedCount - sitemapUrls.length}개`)
console.log(`========================================\n`)
