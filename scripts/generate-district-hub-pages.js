import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  generateImageCarouselSchema,
  generateHubFAQSchema
} from './schema-generators.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://housepick-web.vercel.app'

// 데이터 로드
const dataPath = path.join(__dirname, '..', 'data')
const apartmentsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'apartments.json'), 'utf-8'))

// 템플릿 로드
const templatePath = path.join(__dirname, '..', 'templates', 'district-hub.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// dist 디렉토리 확인
const distPath = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(distPath)) {
  console.log('dist 폴더가 없습니다. 먼저 npm run build를 실행하세요.')
  process.exit(1)
}

// dist/regional.html에서 빌드된 JS/CSS 경로 추출
const regionalHtmlPath = path.join(distPath, 'regional.html')
const regionalHtml = fs.readFileSync(regionalHtmlPath, 'utf-8')

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

// 입주예정 전용 district 제외 목록
const excludeList = [
  'gyeonggi/bucheon', 'gyeonggi/suwon', 'gyeonggi/goyang', 'gyeonggi/gwangju',
  'gyeonggi/seongnam', 'gyeonggi/ansan', 'gyeonggi/anyang', 'gyeonggi/yongin',
  'gyeonggi/gwacheon', 'incheon/seogu', 'incheon/junggu'
]

// aptType 설명 생성
function getAptTypeDesc(avgYear) {
  const currentYear = new Date().getFullYear()
  const avgAge = currentYear - avgYear

  if (avgAge <= 10) {
    return '비교적 신축 아파트가 많아 입주 전 줄눈시공이 인기입니다.'
  } else if (avgAge <= 20) {
    return '줄눈 재시공이 필요한 시기의 아파트가 많습니다. 케라폭시로 깔끔하게 리뉴얼하세요.'
  } else {
    return '오래된 아파트가 많아 묵은 곰팡이 제거와 줄눈 재시공이 특히 필요합니다.'
  }
}

// JSON-LD LocalBusiness 생성
function getJsonLdLocalBusiness(districtName, regionName, canonicalUrl) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `하우스픽 ${districtName} 줄눈시공`,
    "description": `${districtName} 아파트 줄눈시공 전문 업체. 정찰제 가격, 5년 무상 A/S.`,
    "url": canonicalUrl,
    "telephone": "010-6461-0131",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": districtName,
      "addressRegion": regionName,
      "addressCountry": "KR"
    },
    "priceRange": "₩₩",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "4200"
    }
  }, null, 2)
}

// JSON-LD BreadcrumbList 생성
function getJsonLdBreadcrumb(regionSlug, regionName, districtSlug, districtName, canonicalUrl) {
  return JSON.stringify({
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
        "name": `${regionName} 줄눈시공`,
        "item": `${BASE_URL}/${regionSlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${districtName} 줄눈시공`,
        "item": canonicalUrl
      }
    ]
  }, null, 2)
}

// 메인 생성 로직
console.log(`\n구 단위 허브 페이지 생성 시작...`)

let generatedCount = 0
const districtStats = {}
const sitemapUrls = []

for (const [regionSlug, districts] of Object.entries(apartmentsData)) {
  const regionName = regionNames[regionSlug] || regionSlug
  districtStats[regionSlug] = {}

  // 같은 지역 내 district 목록 수집 (인근 지역 링크용)
  const regionDistricts = []
  for (const [districtSlug, districtData] of Object.entries(districts)) {
    const key = `${regionSlug}/${districtSlug}`
    if (excludeList.includes(key)) continue

    const apts = districtData.apartments
    const existingCount = apts.filter(a => !a.isUpcoming).length
    if (existingCount > 0) {
      regionDistricts.push({
        slug: districtSlug,
        name: districtData.name,
        households: apts.reduce((sum, a) => sum + (a.households || 0), 0)
      })
    }
  }
  regionDistricts.sort((a, b) => b.households - a.households)

  for (const [districtSlug, districtData] of Object.entries(districts)) {
    const key = `${regionSlug}/${districtSlug}`

    // 제외 대상 스킵
    if (excludeList.includes(key)) continue

    const apts = districtData.apartments
    const existingApts = apts.filter(a => !a.isUpcoming)
    const existingCount = existingApts.length

    // 기존 아파트가 없으면 스킵
    if (existingCount === 0) continue

    const districtName = districtData.name
    const totalHouseholds = apts.reduce((sum, a) => sum + (a.households || 0), 0)
    const avgYear = Math.round(existingApts.reduce((sum, a) => sum + (a.year || 2020), 0) / existingCount)
    const canonicalUrl = `${BASE_URL}/${regionSlug}/${districtSlug}/julnoon`

    // district 통계 저장
    districtStats[regionSlug][districtSlug] = {
      name: districtName,
      aptCount: apts.length,
      existingCount,
      upcomingCount: apts.length - existingCount,
      totalHouseholds,
      avgYear
    }

    // 세대수 상위 10개 아파트 (기존만)
    const topApts = [...existingApts]
      .sort((a, b) => (b.households || 0) - (a.households || 0))
      .slice(0, 10)

    const topAptsHtml = topApts.map(apt =>
      `          <a href="/${regionSlug}/${districtSlug}/${apt.slug}" class="apt-card">
            <div class="apt-card-name">${apt.name}</div>
            <div class="apt-card-info">${(apt.households || 0).toLocaleString()}세대 · ${apt.year || ''}년</div>
          </a>`
    ).join('\n')

    // 인근 지역 링크 (자기 자신 제외, 최대 8개)
    const nearbyDistricts = regionDistricts
      .filter(d => d.slug !== districtSlug)
      .slice(0, 8)

    const nearbyHtml = nearbyDistricts.map(d =>
      `            <a href="/${regionSlug}/${d.slug}/julnoon">${d.name} 줄눈시공</a>`
    ).join('\n')

    // 리치 스니펫 스키마 생성
    const hubFaqSchema = generateHubFAQSchema(districtName, apts.length, totalHouseholds, avgYear)
    const imageCarouselSchema = generateImageCarouselSchema(districtName, topApts, regionSlug, districtSlug)

    // HTML 생성
    let html = template
      .replace(/\{\{DISTRICT_NAME\}\}/g, districtName)
      .replace(/\{\{DISTRICT_SLUG\}\}/g, districtSlug)
      .replace(/\{\{REGION_NAME\}\}/g, regionName)
      .replace(/\{\{REGION_SLUG\}\}/g, regionSlug)
      .replace(/\{\{APT_COUNT\}\}/g, apts.length.toString())
      .replace(/\{\{TOTAL_HOUSEHOLDS\}\}/g, totalHouseholds.toLocaleString())
      .replace(/\{\{AVG_YEAR\}\}/g, avgYear.toString())
      .replace(/\{\{APT_TYPE_DESC\}\}/g, getAptTypeDesc(avgYear))
      .replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl)
      .replace(/\{\{VITE_JS\}\}/g, viteJs)
      .replace(/\{\{VITE_CSS\}\}/g, viteCss)
      .replace(/\{\{JSON_LD_LOCAL_BUSINESS\}\}/g, getJsonLdLocalBusiness(districtName, regionName, canonicalUrl))
      .replace(/\{\{JSON_LD_BREADCRUMB\}\}/g, getJsonLdBreadcrumb(regionSlug, regionName, districtSlug, districtName, canonicalUrl))
      .replace(/\{\{JSON_LD_HUB_FAQ\}\}/g, JSON.stringify(hubFaqSchema, null, 2))
      .replace(/\{\{JSON_LD_IMAGE_CAROUSEL\}\}/g, JSON.stringify(imageCarouselSchema, null, 2))
      .replace(/\{\{TOP_APTS_HTML\}\}/g, topAptsHtml)
      .replace(/\{\{NEARBY_DISTRICTS_HTML\}\}/g, nearbyHtml)

    // dist 폴더에 저장: dist/{region}/{district}/julnoon/index.html
    const outputDir = path.join(distPath, regionSlug, districtSlug, 'julnoon')
    fs.mkdirSync(outputDir, { recursive: true })
    fs.writeFileSync(path.join(outputDir, 'index.html'), html)

    generatedCount++
    sitemapUrls.push(canonicalUrl)
  }
}

console.log(`\n✅ 구 단위 허브 페이지 생성 완료: ${generatedCount}개`)

// district-stats.json 저장
const statsPath = path.join(dataPath, 'district-stats.json')
fs.writeFileSync(statsPath, JSON.stringify(districtStats, null, 2))
console.log(`✅ district-stats.json 생성 완료`)

// sitemap.xml에 허브 URL 추가
const existingSitemapPath = path.join(distPath, 'sitemap.xml')
if (fs.existsSync(existingSitemapPath)) {
  let sitemap = fs.readFileSync(existingSitemapPath, 'utf-8')
  const today = new Date().toISOString().split('T')[0]

  const hubUrlsXml = sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')

  // </urlset> 앞에 허브 URL 삽입
  sitemap = sitemap.replace('</urlset>', `${hubUrlsXml}\n</urlset>`)

  fs.writeFileSync(existingSitemapPath, sitemap)
  console.log(`✅ sitemap.xml 업데이트 완료 (허브 ${sitemapUrls.length}개 URL 추가)`)
}

// 결과 요약
console.log(`\n========================================`)
console.log(`📊 생성 결과 요약`)
console.log(`========================================`)
console.log(`총 허브 페이지: ${generatedCount}개`)
console.log(`  - 서울: ${Object.keys(districtStats.seoul || {}).length}개`)
console.log(`  - 경기: ${Object.keys(districtStats.gyeonggi || {}).length}개`)
console.log(`  - 인천: ${Object.keys(districtStats.incheon || {}).length}개`)
console.log(`========================================\n`)
