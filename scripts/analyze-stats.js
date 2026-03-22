import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 데이터 로드
const apartmentsPath = path.join(__dirname, '../data/apartments.json')
const apartments = JSON.parse(fs.readFileSync(apartmentsPath, 'utf8'))

// 현재 날짜 기준
const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1

// 통계 계산
function analyzeStats() {
  const allApartments = []
  const districtStats = {}
  const brandStats = {}
  const yearDistribution = {}
  const upcomingByMonth = {}

  // 모든 아파트 수집
  for (const [region, districts] of Object.entries(apartments)) {
    for (const [districtKey, district] of Object.entries(districts)) {
      if (!district.apartments) continue

      const districtName = district.name

      for (const apt of district.apartments) {
        const aptData = {
          ...apt,
          region,
          districtKey,
          districtName
        }
        allApartments.push(aptData)

        // 구별 통계
        if (!districtStats[districtName]) {
          districtStats[districtName] = {
            key: districtKey,
            region,
            total: 0,
            needsRenovation: 0,
            totalHouseholds: 0,
            renovationHouseholds: 0
          }
        }
        districtStats[districtName].total++
        districtStats[districtName].totalHouseholds += apt.households || 0

        // 7년 이상 경과 = 시공 필요
        const aptYear = apt.year || apt.expectedYear
        if (aptYear && aptYear <= currentYear - 7) {
          districtStats[districtName].needsRenovation++
          districtStats[districtName].renovationHouseholds += apt.households || 0
        }

        // 브랜드별 통계
        const brand = apt.brand || '기타'
        if (!brandStats[brand]) {
          brandStats[brand] = {
            total: 0,
            needsRenovation: 0,
            totalHouseholds: 0,
            avgAge: 0,
            years: []
          }
        }
        brandStats[brand].total++
        brandStats[brand].totalHouseholds += apt.households || 0
        if (aptYear) {
          brandStats[brand].years.push(aptYear)
        }
        if (aptYear && aptYear <= currentYear - 7) {
          brandStats[brand].needsRenovation++
        }

        // 연도별 분포
        if (aptYear) {
          if (!yearDistribution[aptYear]) {
            yearDistribution[aptYear] = { count: 0, households: 0 }
          }
          yearDistribution[aptYear].count++
          yearDistribution[aptYear].households += apt.households || 0
        }

        // 입주예정 (미래 연도)
        if (apt.expectedYear && apt.expectedMonth) {
          const key = `${apt.expectedYear}-${String(apt.expectedMonth).padStart(2, '0')}`
          if (!upcomingByMonth[key]) {
            upcomingByMonth[key] = { count: 0, households: 0, apartments: [] }
          }
          upcomingByMonth[key].count++
          upcomingByMonth[key].households += apt.households || 0
          upcomingByMonth[key].apartments.push({
            name: apt.name,
            district: districtName,
            households: apt.households
          })
        }
      }
    }
  }

  // 브랜드별 평균 연식 계산
  for (const brand of Object.keys(brandStats)) {
    const years = brandStats[brand].years
    if (years.length > 0) {
      const avgYear = years.reduce((a, b) => a + b, 0) / years.length
      brandStats[brand].avgAge = Math.round((currentYear - avgYear) * 10) / 10
    }
    delete brandStats[brand].years
  }

  // 전체 통계
  const totalCount = allApartments.length
  const needsRenovation = allApartments.filter(apt => {
    const year = apt.year || apt.expectedYear
    return year && year <= currentYear - 7
  }).length
  const renovationRate = Math.round((needsRenovation / totalCount) * 1000) / 10
  const upcomingCount = allApartments.filter(apt => apt.expectedYear).length

  // 구별 노후도 순위 (노후율 내림차순)
  const districtRanking = Object.entries(districtStats)
    .map(([name, stats]) => ({
      name,
      key: stats.key,
      region: stats.region,
      total: stats.total,
      needsRenovation: stats.needsRenovation,
      renovationRate: Math.round((stats.needsRenovation / stats.total) * 1000) / 10,
      totalHouseholds: stats.totalHouseholds,
      renovationHouseholds: stats.renovationHouseholds
    }))
    .filter(d => d.total >= 5) // 최소 5개 단지 이상
    .sort((a, b) => b.renovationRate - a.renovationRate)

  // 브랜드 통계 정렬 (단지 수 기준)
  const brandRanking = Object.entries(brandStats)
    .map(([name, stats]) => ({
      name,
      total: stats.total,
      needsRenovation: stats.needsRenovation,
      renovationRate: Math.round((stats.needsRenovation / stats.total) * 1000) / 10,
      totalHouseholds: stats.totalHouseholds,
      avgAge: stats.avgAge
    }))
    .filter(b => b.total >= 10) // 최소 10개 단지 이상
    .sort((a, b) => b.total - a.total)

  // 연도별 분포 정렬
  const yearStats = Object.entries(yearDistribution)
    .map(([year, stats]) => ({
      year: parseInt(year),
      count: stats.count,
      households: stats.households
    }))
    .sort((a, b) => a.year - b.year)

  // 입주예정 정렬
  const upcomingStats = Object.entries(upcomingByMonth)
    .map(([month, stats]) => ({
      month,
      count: stats.count,
      households: stats.households,
      apartments: stats.apartments.sort((a, b) => b.households - a.households).slice(0, 5)
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(0, 12) // 향후 12개월

  // 총 세대수 계산
  const totalHouseholds = allApartments.reduce((sum, apt) => sum + (apt.households || 0), 0)
  const renovationHouseholds = allApartments
    .filter(apt => {
      const year = apt.year || apt.expectedYear
      return year && year <= currentYear - 7
    })
    .reduce((sum, apt) => sum + (apt.households || 0), 0)

  // 결과 객체
  const result = {
    meta: {
      generatedAt: now.toISOString(),
      dataVersion: '1.0',
      source: 'housepick-apartments-db'
    },
    summary: {
      totalCount,
      needsRenovation,
      renovationRate,
      upcomingCount,
      totalHouseholds,
      renovationHouseholds,
      analysisYear: currentYear,
      analysisMonth: currentMonth
    },
    districtRanking,
    brandRanking,
    yearDistribution: yearStats,
    upcomingByMonth: upcomingStats
  }

  return result
}

// 실행
const stats = analyzeStats()

// 저장
const outputPath = path.join(__dirname, '../data/stats-summary.json')
fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2), 'utf8')

console.log('✅ 통계 분석 완료')
console.log(`   총 단지 수: ${stats.summary.totalCount.toLocaleString()}개`)
console.log(`   시공 필요 단지: ${stats.summary.needsRenovation.toLocaleString()}개 (${stats.summary.renovationRate}%)`)
console.log(`   총 세대수: ${stats.summary.totalHouseholds.toLocaleString()}세대`)
console.log(`   시공 필요 세대: ${stats.summary.renovationHouseholds.toLocaleString()}세대`)
console.log(`   구별 순위: ${stats.districtRanking.length}개 구`)
console.log(`   브랜드: ${stats.brandRanking.length}개`)
console.log(`   입주예정: ${stats.upcomingByMonth.length}개월`)
console.log(`\n📁 저장: ${outputPath}`)
