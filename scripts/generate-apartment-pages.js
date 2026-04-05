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

// 시공 사례 카드 데이터 로드 (case-cards.json)
const caseCardsPath = path.join(dataPath, 'case-cards.json')
let caseCardsData = {}
if (fs.existsSync(caseCardsPath)) {
  caseCardsData = JSON.parse(fs.readFileSync(caseCardsPath, 'utf-8'))
}

function getCaseCardsHtml(aptSlug, regionSlug, districtSlug) {
  const cards = caseCardsData[aptSlug]
  if (!cards || cards.length === 0) return ''

  const cardItems = cards.slice(0, 6).map(card => {
    const tag = card.url ? 'a' : 'div'
    const href = card.url ? ` href="${card.url}"` : ''
    const linkStyle = card.url ? 'text-decoration:none;' : ''
    return `
          <${tag}${href} style="display:block;background:white;border-radius:12px;overflow:hidden;${linkStyle}color:#1c1917;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            ${card.afterImage ? `<img src="${card.afterImage}" alt="${card.spaceText} 시공 후" style="width:100%;aspect-ratio:4/3;object-fit:cover;" loading="lazy">` : ''}
            <div style="padding:0.8rem;">
              <div style="font-weight:600;font-size:0.85rem;">${card.spaceText} ${card.issueText} 시공</div>
              <div style="font-size:0.75rem;color:#a8a29e;">${card.materialText} · ${card.workDate}</div>
            </div>
          </${tag}>`
  }).join('\n')

  return `      <section style="padding:2rem 1rem;max-width:800px;margin:0 auto;">
        <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:1rem;">실제 시공 사례 (${cards.length}건)</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.8rem;">
${cardItems}
        </div>
      </section>`
}

// Supabase 거래량 데이터 로드 (빌드 시 priority 반영)
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || ''
let tradeData = new Map() // key: 아파트명, value: 거래건수

async function loadTradeData() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('  ℹ️ SUPABASE 환경변수 없음 → 거래량 priority 미적용')
    return
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/apartment_trades?select=apartment_name,trade_count&order=trade_count.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
      }
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const rows = await res.json()
    for (const row of rows) {
      const existing = tradeData.get(row.apartment_name) || 0
      tradeData.set(row.apartment_name, existing + row.trade_count)
    }
    console.log(`  ✅ Supabase 거래량 데이터 로드: ${tradeData.size}개 아파트`)
  } catch (e) {
    console.log(`  ⚠️ Supabase 거래량 로드 실패 (기본 priority 사용): ${e.message}`)
  }
}

function getTradePriority(apt) {
  if (apt.isUpcoming) return '0.8'
  const count = tradeData.get(apt.name) || 0
  if (count >= 20) return '0.9'
  if (count >= 10) return '0.8'
  if (count >= 5) return '0.7'
  if (apt.phase === 1) return '0.7'
  return '0.6'
}

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
  const month = apt.month || 6
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

  // 세대수 기반 구체적 수요 계산 (complexType별 차별화)
  const demandNote = (() => {
    if (complexType === '대단지') {
      return `${apt.households.toLocaleString()}세대 중 입주 후 5~7년 경과 세대 약 ${Math.round(apt.households * 0.3).toLocaleString()}세대가 줄눈시공 적기에 해당합니다`
    }
    if (complexType === '중형단지') {
      return `${apt.households.toLocaleString()}세대 규모로 연간 약 ${Math.round(apt.households * 0.15)}건의 줄눈시공 수요가 예상됩니다`
    }
    return `${apt.households.toLocaleString()}세대 소형단지로 월 평균 ${Math.max(1, Math.round(apt.households * 0.02))}건 내외의 시공이 진행됩니다`
  })()

  // 난방방식별 특성 (준공연월 + 세대수 연동)
  const heatingNote = {
    '중앙난방': `${apt.year}년 ${monthNames[month - 1]} 준공 기준 중앙난방 방식으로, 계절별 온도 편차가 커 줄눈 수축·팽창이 연간 약 ${Math.round(apt.households * 0.12)}회 이상 반복됩니다`,
    '개별난방(구형)': `${apt.year}년 ${monthNames[month - 1]} 준공 기준 구형 개별난방으로, 욕실 바닥 온도 불균일로 ${apt.households.toLocaleString()}세대 중 약 ${Math.round(apt.households * 0.35).toLocaleString()}세대에서 줄눈 문제 가능성이 있습니다`,
    '개별난방(신형)': `${apt.year}년 ${monthNames[month - 1]} 준공 기준 신형 개별난방으로, ${apt.households.toLocaleString()}세대 규모에서 세대별 습기 관리 차이에 따른 줄눈 상태 편차가 발생합니다`
  }[heating]

  // 타일종류별 특성 (정확한 경과개월 연동)
  const tileNote = {
    '포세린': `포세린 타일 특성상 현재까지 정확히 ${ageMonths}개월 경과로 오염 침투 깊이가 평균 ${Math.min(3.5, (ageMonths / 24).toFixed(1))}mm에 도달했을 것으로 추정됩니다`,
    '세라믹': `세라믹 타일은 흡수율이 높아 현재까지 정확히 ${ageMonths}개월 경과 시점에서 줄눈 변색률 약 ${Math.min(85, Math.round(ageMonths * 0.8))}%로 추정됩니다`,
    '강화세라믹': `강화세라믹 타일은 현재까지 정확히 ${ageMonths}개월 경과로 줄눈 경계면 미세균열이 약 ${Math.min(120, Math.round(ageMonths * 1.2))}μm까지 확장되었을 수 있습니다`
  }[tileType]

  // 경과기간별 진단
  const ageNote = (() => {
    if (ageMonths <= 36) {
      return `입주 초기(${ageMonths}개월차)로 줄눈 코팅 시 오염 원천 차단이 가능한 최적 시기입니다`
    }
    if (ageMonths <= 84) {
      return `${ageMonths}개월(${Math.floor(ageMonths / 12)}년 ${ageMonths % 12}개월)차로 줄눈 변색이 본격화되는 구간이며 재시공 적기입니다`
    }
    return `${ageMonths}개월(${Math.floor(ageMonths / 12)}년)차로 줄눈 내부 곰팡이 침투가 진행되어 전면 재시공을 권장합니다`
  })()

  return `${apt.name}은 ${heatingNote}. ${tileNote}. ${demandNote}. ${ageNote}.`
}

// 세대수 기반 단지 특성 문구 생성
function getComplexNote(apt) {
  const complexType = getComplexType(apt.households)
  const ageMonths = getAgeMonths(apt.year, apt.month)
  const month = apt.month || 6
  const bathroomCount = apt.households * 2
  const monthlyDemand = Math.max(1, Math.round(apt.households * 0.007))
  const yearlyDemand = Math.round(apt.households * 0.08)
  const discoloredBathrooms = Math.round(bathroomCount * ageMonths / 1200)

  if (complexType === '대단지') {
    const dongCount = Math.max(5, Math.round(apt.households / 300))
    return `${apt.name}은 총 ${apt.households.toLocaleString()}세대, 약 ${dongCount}개동 규모의 대단지입니다. ${apt.year}년 ${month}월 준공 후 ${ageMonths}개월이 경과했으며, 욕실 ${bathroomCount.toLocaleString()}개 중 약 ${discoloredBathrooms.toLocaleString()}개에서 줄눈 변색이 진행 중으로 추정됩니다. 월평균 ${monthlyDemand}건, 연간 ${yearlyDemand}건의 시공 수요가 예상됩니다.`
  }
  if (complexType === '중형단지') {
    const groupDiscount = Math.max(3, Math.round(apt.households * 0.03))
    return `${apt.name}은 ${apt.households.toLocaleString()}세대 중형단지로, ${apt.year}년 ${month}월 준공 후 현재 ${ageMonths}개월이 경과했습니다. 욕실 총 ${bathroomCount.toLocaleString()}개 중 약 ${discoloredBathrooms.toLocaleString()}개에서 변색 진행 중 추정이며, ${groupDiscount}세대 이상 동시 시공 시 할인 적용됩니다.`
  }
  const weeklyInquiry = Math.max(1, Math.round(apt.households * 0.005))
  return `${apt.name}은 ${apt.households.toLocaleString()}세대 소형단지입니다. ${apt.year}년 ${month}월 준공 기준 ${ageMonths}개월 경과로, 욕실 ${bathroomCount.toLocaleString()}개 중 약 ${Math.round(apt.households * 0.15)}개에서 재시공이 필요합니다. 주간 ${weeklyInquiry}건 내외 문의가 예상되며, 소규모 단지는 일정 조율이 유연합니다.`
}

// [DEPRECATED] 기존 메시지 시스템은 generateAnalysis()와 getComplexNote()로 대체됨

// title 패턴 (aptType별 차별화)
function getTitle(apt, caseCount) {
  const type = getAptType(apt.year)
  // 허브: [아파트명] 줄눈시공 | 시공 포인트와 최신 사례 (메인 키워드)
  // 사례: [아파트명] [공간] [자재] 줄눈시공 | [문제유형] 개선 사례 (롱테일, case-detail에서 처리)
  if (caseCount > 0) {
    if (type === 'new') return `${apt.name} 줄눈시공 | 입주 시공 포인트와 최신 사례`
    if (type === 'mid') return `${apt.name} 줄눈시공 | 욕실·현관 시공 사례 ${caseCount}건`
    return `${apt.name} 줄눈시공 | 재시공 사례와 시공 포인트`
  }
  if (type === 'new') return `${apt.name} 입주 줄눈시공 | 정찰제 견적 · 하우스픽`
  if (type === 'mid') return `${apt.name} 줄눈시공 전문업체 | 하우스픽`
  return `${apt.name} 줄눈 곰팡이 제거 재시공 | 하우스픽`
}

// Meta description 생성
function getMetaDescription(apt, districtName, caseCount) {
  const base = `${districtName} ${apt.name} 케라폭시 줄눈시공 전문 하우스픽. ${apt.households}세대 아파트.`
  if (caseCount > 0) {
    return `${base} 실제 시공 사례 ${caseCount}건, Before/After 사진 포함. 정찰제 가격, 5년 무상 A/S.`
  }
  return `${base} 현장 출장 무료견적, 당일 시공 가능. 5년 무상 A/S 보장.`
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
async function generatePages() {
console.log(`\n아파트 페이지 생성 시작...`)
console.log(`현재 Phase: ${settings.currentPhase}`)
console.log(`현재 날짜: ${new Date().toISOString().split('T')[0]}`)

// 거래량 데이터 로드 (Supabase)
await loadTradeData()

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
      const aptCases = caseCardsData[apt.slug] || []
      const caseCount = aptCases.length
      const title = getTitle(apt, caseCount)
      const description = getMetaDescription(apt, districtName, caseCount)
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
        .replace('{{CASE_CARDS_HTML}}', getCaseCardsHtml(apt.slug, regionSlug, districtSlug))

      // dist 폴더에 저장: dist/{region}/{district}/{apt-slug}/index.html
      const outputDir = path.join(distPath, regionSlug, districtSlug, apt.slug)
      fs.mkdirSync(outputDir, { recursive: true })
      fs.writeFileSync(path.join(outputDir, 'index.html'), html)

      generatedCount++

      // Sitemap 포함 여부 결정 (기존 + 입주예정 통합)
      if (shouldIncludeInSitemap(apt)) {
        sitemapUrls.push({
          url: canonicalUrl,
          priority: getTradePriority(apt)
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
if (tradeData.size > 0) {
  const highPriority = sitemapUrls.filter(u => u.priority === '0.9').length
  console.log(`  - 거래량 기반 우선순위 0.9: ${highPriority}개`)
}
console.log(`========================================\n`)

} // end generatePages

generatePages().catch(console.error)
