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

// aptType 계산 (준공년도 기준)
function getAptType(year) {
  const currentYear = new Date().getFullYear()
  const age = currentYear - year
  if (age <= 10) return 'new'      // 10년 이하 = 신축
  if (age <= 20) return 'mid'      // 11~20년 = 중년차
  return 'old'                      // 21년 이상 = 구축
}

// aptType별 본문 문구 (중복 콘텐츠 방지 핵심)
const typeMessages = {
  new: (name, year) => `${name}은 ${year}년 준공된 신축 아파트입니다. 입주 전 줄눈시공이 필수인 이유 — 새 아파트일수록 빠른 케라폭시 코팅으로 오염을 원천 차단할 수 있습니다. 처음부터 깔끔하게 관리하면 10년 후에도 새것 같은 욕실을 유지할 수 있습니다.`,
  mid: (name, year) => `${name}은 ${year}년 준공되어 지금이 줄눈 재시공 적기입니다. 10~15년 된 아파트의 욕실 줄눈은 눈에 보이지 않는 곰팡이 포자가 이미 깊숙이 침투해 있을 가능성이 높습니다. 케라폭시 줄눈시공으로 위생적인 욕실 환경을 되찾으세요.`,
  old: (name, year) => `${name}은 ${year}년 준공된 아파트로, 오래된 실리콘 줄눈에 쌓인 묵은 곰팡이와 변색을 케라폭시로 완전히 제거할 수 있습니다. 리모델링 없이도 깔끔한 욕실로 탈바꿈합니다.`
}

// 시공사별 본문 문구
const brandMessages = {
  '삼성물산': (name) => `${name}은 래미안 브랜드 특유의 고밀도 타일이 적용되어 있습니다. 하우스픽은 래미안 아파트에 최적화된 케라폭시 시공 노하우로 완벽한 마감을 제공합니다.`,
  '현대건설': (name) => `${name}은 힐스테이트 브랜드의 프리미엄 욕실 인테리어가 특징입니다. 고급스러운 타일 줄눈을 케라폭시로 더욱 돋보이게 시공합니다.`,
  'GS건설': (name) => `${name}은 자이 브랜드의 세련된 욕실 디자인이 적용되어 있습니다. 케라폭시 줄눈시공으로 자이 욕실의 청결함을 오래 유지하세요.`,
  '대우건설': (name) => `${name}은 푸르지오 브랜드의 실용적인 욕실 설계가 특징입니다. 케라폭시 줄눈으로 푸르지오 특유의 깔끔함을 더욱 살려드립니다.`,
  'DL이앤씨': (name) => `${name}은 e편한세상 브랜드의 편안한 생활 공간이 특징입니다. 케라폭시 줄눈시공으로 e편한세상의 쾌적함을 완성하세요.`,
  '포스코건설': (name) => `${name}은 더샵 브랜드의 고품격 마감재가 적용되어 있습니다. 케라폭시로 더샵 욕실의 프리미엄 느낌을 유지하세요.`,
  '롯데건설': (name) => `${name}은 롯데캐슬 브랜드의 럭셔리한 인테리어가 특징입니다. 케라폭시 줄눈으로 롯데캐슬의 고급스러움을 완성합니다.`,
  'HDC현대산업개발': (name) => `${name}은 아이파크 브랜드의 현대적인 디자인이 적용되어 있습니다. 케라폭시 줄눈시공으로 아이파크 욕실을 더욱 깔끔하게 관리하세요.`
}
const defaultBrandMessage = (name) => `${name} 아파트의 욕실 타일 줄눈을 이탈리아 정품 케라폭시로 전문 시공합니다. 곰팡이 걱정 없는 청결한 욕실 환경을 만들어 드립니다.`

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

      const brandMsg = (brandMessages[apt.brand] || defaultBrandMessage)(apt.name)
      const typeMsg = typeMessages[aptType](apt.name, apt.year)

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
        .replace(/\{\{TYPE_MESSAGE\}\}/g, typeMsg)
        .replace(/\{\{BRAND_MESSAGE\}\}/g, brandMsg)
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
