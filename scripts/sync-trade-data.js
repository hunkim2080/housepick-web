/**
 * 로컬 일괄 수집 스크립트
 * PC에서 직접 실행: node scripts/sync-trade-data.js
 * 84개 구를 한번에 수집하여 Supabase에 저장
 *
 * 용도: 초기 데이터 적재 또는 수동 갱신 시 사용
 */

import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─── 설정 ──────────────────────────────────────────────────────────────
// 환경변수 또는 직접 입력 (로컬 실행용)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bnzgtqktvevqxtnceiwv.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || ''
const MOLIT_API_KEY = process.env.MOLIT_API_KEY || ''

if (!SUPABASE_KEY || !MOLIT_API_KEY) {
  console.error('환경변수를 설정하세요:')
  console.error('  $env:SUPABASE_SECRET_KEY="sb_secret_..."')
  console.error('  $env:MOLIT_API_KEY="..."')
  process.exit(1)
}

const DISTRICTS = [
  // 서울 (25)
  { code: '11110', name: '종로구' },
  { code: '11140', name: '중구' },
  { code: '11170', name: '용산구' },
  { code: '11200', name: '성동구' },
  { code: '11215', name: '광진구' },
  { code: '11230', name: '동대문구' },
  { code: '11260', name: '중랑구' },
  { code: '11290', name: '성북구' },
  { code: '11305', name: '강북구' },
  { code: '11320', name: '도봉구' },
  { code: '11350', name: '노원구' },
  { code: '11380', name: '은평구' },
  { code: '11410', name: '서대문구' },
  { code: '11440', name: '마포구' },
  { code: '11470', name: '양천구' },
  { code: '11500', name: '강서구' },
  { code: '11530', name: '구로구' },
  { code: '11545', name: '금천구' },
  { code: '11560', name: '영등포구' },
  { code: '11590', name: '동작구' },
  { code: '11620', name: '관악구' },
  { code: '11650', name: '서초구' },
  { code: '11680', name: '강남구' },
  { code: '11710', name: '송파구' },
  { code: '11740', name: '강동구' },
  // 경기 (37)
  { code: '41111', name: '수원시 장안구' },
  { code: '41113', name: '수원시 권선구' },
  { code: '41115', name: '수원시 팔달구' },
  { code: '41117', name: '수원시 영통구' },
  { code: '41131', name: '성남시 수정구' },
  { code: '41133', name: '성남시 중원구' },
  { code: '41135', name: '성남시 분당구' },
  { code: '41150', name: '의정부시' },
  { code: '41171', name: '안양시 만안구' },
  { code: '41173', name: '안양시 동안구' },
  { code: '41190', name: '부천시' },
  { code: '41210', name: '광명시' },
  { code: '41220', name: '평택시' },
  { code: '41250', name: '동두천시' },
  { code: '41271', name: '안산시 상록구' },
  { code: '41273', name: '안산시 단원구' },
  { code: '41281', name: '고양시 덕양구' },
  { code: '41285', name: '고양시 일산동구' },
  { code: '41287', name: '고양시 일산서구' },
  { code: '41310', name: '구리시' },
  { code: '41360', name: '남양주시' },
  { code: '41370', name: '오산시' },
  { code: '41390', name: '시흥시' },
  { code: '41410', name: '군포시' },
  { code: '41430', name: '의왕시' },
  { code: '41450', name: '하남시' },
  { code: '41461', name: '용인시 처인구' },
  { code: '41463', name: '용인시 기흥구' },
  { code: '41465', name: '용인시 수지구' },
  { code: '41480', name: '파주시' },
  { code: '41500', name: '이천시' },
  { code: '41550', name: '안성시' },
  { code: '41570', name: '김포시' },
  { code: '41590', name: '화성시' },
  { code: '41610', name: '광주시' },
  { code: '41630', name: '양주시' },
  { code: '41650', name: '포천시' },
  // 인천 (10)
  { code: '28110', name: '중구(인천)' },
  { code: '28140', name: '동구(인천)' },
  { code: '28177', name: '미추홀구' },
  { code: '28185', name: '연수구' },
  { code: '28200', name: '남동구' },
  { code: '28237', name: '부평구' },
  { code: '28245', name: '계양구' },
  { code: '28260', name: '서구(인천)' },
  { code: '28710', name: '강화군' },
  { code: '28720', name: '옹진군' },
]

// ─── 유틸리티 ──────────────────────────────────────────────────────────

function getDealMonth() {
  const d = new Date()
  d.setMonth(d.getMonth() - 2)
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`
}

function parseTradeXml(xmlText) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const block = match[1]
    const getTag = (tag) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))
      return m ? m[1].trim() : ''
    }
    items.push({
      aptName: getTag('aptNm'),
      dong: getTag('umdNm'),
    })
  }
  return items
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ─── 메인 ──────────────────────────────────────────────────────────────

async function main() {
  const dealMonth = getDealMonth()
  console.log(`\n========================================`)
  console.log(`아파트 거래량 일괄 수집`)
  console.log(`거래년월: ${dealMonth} (2개월 전 기준)`)
  console.log(`대상: ${DISTRICTS.length}개 구`)
  console.log(`========================================\n`)

  // 기존 데이터 삭제 (같은 월)
  console.log(`기존 ${dealMonth} 데이터 삭제 중...`)
  const deleteRes = await fetch(
    `${SUPABASE_URL}/rest/v1/apartment_trades?deal_month=eq.${dealMonth}`,
    {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      }
    }
  )
  console.log(`삭제 완료 (status: ${deleteRes.status})\n`)

  let totalApts = 0
  let totalTrades = 0
  let errorCount = 0

  for (let i = 0; i < DISTRICTS.length; i++) {
    const district = DISTRICTS[i]
    const progress = `[${i + 1}/${DISTRICTS.length}]`

    try {
      // 국토부 API 호출
      const apiUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${MOLIT_API_KEY}&LAWD_CD=${district.code}&DEAL_YMD=${dealMonth}&pageNo=1&numOfRows=1000`
      const tradeRes = await fetch(apiUrl)
      const xmlText = await tradeRes.text()
      const items = parseTradeXml(xmlText)

      // 아파트별 집계
      const aptCounts = {}
      for (const item of items) {
        if (!item.aptName) continue
        if (!aptCounts[item.aptName]) {
          aptCounts[item.aptName] = { name: item.aptName, dong: item.dong, count: 0 }
        }
        aptCounts[item.aptName].count++
      }

      const rows = Object.values(aptCounts).map(apt => ({
        district_code: district.code,
        district_name: district.name,
        apartment_name: apt.name,
        dong_name: apt.dong,
        trade_count: apt.count,
        deal_month: dealMonth,
      }))

      // Supabase 저장
      if (rows.length > 0) {
        const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/apartment_trades`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(rows),
        })

        if (!insertRes.ok) {
          throw new Error(`Supabase: ${await insertRes.text()}`)
        }
      }

      totalApts += rows.length
      totalTrades += items.length
      console.log(`${progress} ${district.name}: ${items.length}건 거래, ${rows.length}개 아파트`)

      // API 부하 방지 (1초 대기)
      await sleep(1000)

    } catch (error) {
      errorCount++
      console.error(`${progress} ${district.name}: ❌ ${error.message}`)
      await sleep(2000)
    }
  }

  console.log(`\n========================================`)
  console.log(`✅ 수집 완료`)
  console.log(`  거래년월: ${dealMonth}`)
  console.log(`  총 거래: ${totalTrades.toLocaleString()}건`)
  console.log(`  총 아파트: ${totalApts.toLocaleString()}개`)
  console.log(`  에러: ${errorCount}개`)
  console.log(`========================================\n`)
}

main().catch(console.error)
