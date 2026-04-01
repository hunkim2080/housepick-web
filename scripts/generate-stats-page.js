import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateEnhancedDatasetSchema } from './schema-generators.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'https://housepick-web.vercel.app'

// 데이터 로드
const dataPath = path.join(__dirname, '..', 'data')
const stats = JSON.parse(fs.readFileSync(path.join(dataPath, 'stats-summary.json'), 'utf-8'))

// 템플릿 로드
const templatePath = path.join(__dirname, '..', 'templates', 'stats.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// dist 디렉토리 확인
const distPath = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(distPath)) {
  console.log('dist 폴더가 없습니다. 먼저 npm run build를 실행하세요.')
  process.exit(1)
}

// dist/regional.html에서 빌드된 CSS 경로 추출
const regionalHtmlPath = path.join(distPath, 'regional.html')
const regionalHtml = fs.readFileSync(regionalHtmlPath, 'utf-8')
const cssMatch = regionalHtml.match(/href="(\/assets\/index-[^"]+\.css)"/)
const viteCss = cssMatch ? cssMatch[1] : '/assets/index.css'

console.log(`Vite CSS 파일 감지: ${viteCss}`)

// 지역 slug 매핑
const regionSlugMap = {
  seoul: 'gangnam',
  gyeonggi: 'suwon',
  incheon: 'incheon'
}

// 숫자 포맷팅
function formatNumber(num) {
  return num.toLocaleString('ko-KR')
}

// 구별 순위 테이블 행 생성
function generateDistrictRows(ranking) {
  const top20 = ranking.slice(0, 20)
  return top20.map((district, index) => {
    const rank = index + 1
    const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other'
    const regionSlug = regionSlugMap[district.region] || district.region
    const districtUrl = `/${district.key}`
    const barWidth = Math.min(100, district.renovationRate)

    return `            <tr>
              <td><span class="rank-badge ${rankClass}">${rank}</span></td>
              <td><a href="${districtUrl}" class="district-link">${district.name}</a></td>
              <td>${formatNumber(district.total)}개</td>
              <td>${formatNumber(district.needsRenovation)}개</td>
              <td>
                <div class="rate-bar">
                  <div class="rate-bar-fill" style="width: ${barWidth}%"></div>
                  <span class="rate-value">${district.renovationRate}%</span>
                </div>
              </td>
            </tr>`
  }).join('\n')
}

// 브랜드 카드 생성
function generateBrandCards(brands) {
  return brands.slice(0, 12).map(brand => {
    return `        <div class="brand-card">
          <div class="brand-name">${brand.name}</div>
          <div class="brand-stats">
            <div class="brand-stat-row">
              <span>총 단지</span>
              <span class="brand-stat-value">${formatNumber(brand.total)}개</span>
            </div>
            <div class="brand-stat-row">
              <span>평균 연식</span>
              <span class="brand-stat-value">${brand.avgAge}년</span>
            </div>
            <div class="brand-stat-row">
              <span>준공 7년 이상</span>
              <span class="brand-stat-value">${brand.renovationRate}%</span>
            </div>
          </div>
        </div>`
  }).join('\n')
}

// 연도별 분포 차트 생성
function generateYearDistribution(yearData) {
  // 최근 30년만 필터링
  const currentYear = new Date().getFullYear()
  const filtered = yearData.filter(y => y.year >= currentYear - 30 && y.year <= currentYear)
  const maxCount = Math.max(...filtered.map(y => y.count))
  const renovationThreshold = currentYear - 7

  // 5년 단위로 그룹핑
  const grouped = {}
  for (const item of filtered) {
    const decade = Math.floor(item.year / 5) * 5
    const label = `${decade}-${decade + 4}`
    if (!grouped[label]) {
      grouped[label] = { count: 0, households: 0, isOld: item.year <= renovationThreshold }
    }
    grouped[label].count += item.count
    grouped[label].households += item.households
    // 그룹 내 연도 중 하나라도 7년 이상이면 old 표시
    if (item.year <= renovationThreshold) {
      grouped[label].isOld = true
    }
  }

  const sortedGroups = Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]))
  const groupMaxCount = Math.max(...sortedGroups.map(([_, g]) => g.count))

  return sortedGroups.map(([label, data]) => {
    const barWidth = (data.count / groupMaxCount) * 100
    const fillClass = data.isOld ? 'old' : 'new'

    return `          <div class="year-bar-row">
            <span class="year-label">${label}</span>
            <div class="year-bar">
              <div class="year-bar-fill ${fillClass}" style="width: ${barWidth}%"></div>
            </div>
            <span class="year-count">${formatNumber(data.count)}개</span>
          </div>`
  }).join('\n')
}

// JSON-LD Dataset 스키마 생성 (강화된 버전)
function generateJsonLd(stats) {
  const schema = generateEnhancedDatasetSchema(stats)
  return JSON.stringify(schema, null, 2)
}

// 메인 실행
function generateStatsPage() {
  const now = new Date()
  const publishedDate = '2026-03-01'
  const modifiedDate = now.toISOString().split('T')[0]
  const analysisDate = `${stats.summary.analysisYear}년 ${stats.summary.analysisMonth}월`

  // 템플릿 치환
  let html = template
    .replace(/\{\{TITLE\}\}/g, '2026 수도권 아파트 줄눈 재시공 권장 리포트 | 하우스Pick')
    .replace(/\{\{META_DESCRIPTION\}\}/g, `수도권 ${formatNumber(stats.summary.totalCount)}개 아파트 단지 중 ${stats.summary.renovationRate}%가 줄눈 교체 주기에 도래했습니다. 구별 재시공 권장 순위, 브랜드별 분석, 준공연도 분포 데이터를 확인하세요.`)
    .replace(/\{\{CANONICAL_URL\}\}/g, `${BASE_URL}/stats/metropolitan-grout-index`)
    .replace(/\{\{PUBLISHED_DATE\}\}/g, publishedDate)
    .replace(/\{\{MODIFIED_DATE\}\}/g, modifiedDate)
    .replace(/\{\{VITE_CSS\}\}/g, viteCss)
    .replace(/\{\{JSON_LD\}\}/g, generateJsonLd(stats))
    .replace(/\{\{REPORT_YEAR\}\}/g, stats.summary.analysisYear.toString())
    .replace(/\{\{REPORT_TITLE\}\}/g, '수도권 아파트 줄눈 재시공 권장 리포트')
    .replace(/\{\{REPORT_SUBTITLE\}\}/g, `${formatNumber(stats.summary.totalCount)}개 아파트 단지의 욕실 타일 줄눈 상태 종합 분석`)
    .replace(/\{\{ANALYSIS_DATE\}\}/g, analysisDate)
    .replace(/\{\{TOTAL_APARTMENTS\}\}/g, formatNumber(stats.summary.totalCount))
    .replace(/\{\{TOTAL_COUNT\}\}/g, formatNumber(stats.summary.totalCount))
    .replace(/\{\{RENOVATION_COUNT\}\}/g, formatNumber(stats.summary.needsRenovation))
    .replace(/\{\{RENOVATION_RATE\}\}/g, stats.summary.renovationRate.toString())
    .replace(/\{\{TOTAL_HOUSEHOLDS\}\}/g, formatNumber(stats.summary.totalHouseholds))
    .replace(/\{\{DISTRICT_RANKING_ROWS\}\}/g, generateDistrictRows(stats.districtRanking))
    .replace(/\{\{BRAND_CARDS\}\}/g, generateBrandCards(stats.brandRanking))
    .replace(/\{\{YEAR_DISTRIBUTION\}\}/g, generateYearDistribution(stats.yearDistribution))

  // 디렉토리 생성
  const outputDir = path.join(distPath, 'stats', 'metropolitan-grout-index')
  fs.mkdirSync(outputDir, { recursive: true })

  // HTML 저장
  const outputPath = path.join(outputDir, 'index.html')
  fs.writeFileSync(outputPath, html, 'utf-8')

  // sitemap.xml에 URL 추가
  const sitemapPath = path.join(distPath, 'sitemap.xml')
  if (fs.existsSync(sitemapPath)) {
    let sitemap = fs.readFileSync(sitemapPath, 'utf-8')
    const statsUrl = `${BASE_URL}/stats/metropolitan-grout-index`

    if (!sitemap.includes(statsUrl)) {
      const newEntry = `  <url>
    <loc>${statsUrl}</loc>
    <lastmod>${modifiedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`
      sitemap = sitemap.replace('</urlset>', newEntry)
      fs.writeFileSync(sitemapPath, sitemap, 'utf-8')
      console.log('✅ sitemap.xml에 통계 페이지 URL 추가')
    }
  }

  console.log('✅ 통계 리포트 페이지 생성 완료')
  console.log(`   URL: /stats/metropolitan-grout-index`)
  console.log(`   분석 단지: ${formatNumber(stats.summary.totalCount)}개`)
  console.log(`   재시공 권장 지수: ${stats.summary.renovationRate}%`)
  console.log(`   구별 순위: ${stats.districtRanking.length}개`)
  console.log(`   브랜드: ${stats.brandRanking.length}개`)
}

generateStatsPage()
