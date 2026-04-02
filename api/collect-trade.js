/**
 * Vercel Cron: 아파트 거래량 수집
 * 매시간 실행, 1회에 1개 구 처리 → 84개 구를 약 9일에 순환
 *
 * 환경변수:
 *   CRON_SECRET - Vercel Cron 인증
 *   SUPABASE_URL - https://bnzgtqktvevqxtnceiwv.supabase.co
 *   SUPABASE_SECRET_KEY - sb_secret_...
 *   MOLIT_API_KEY - 국토부 공공데이터 API 키
 */

// 84개 구 지역코드 (서울 25 + 경기 37 + 인천 10 + 기타 12)
const DISTRICTS = [
  // 서울 (25)
  { code: '11110', name: '종로구', region: 'seoul' },
  { code: '11140', name: '중구', region: 'seoul' },
  { code: '11170', name: '용산구', region: 'seoul' },
  { code: '11200', name: '성동구', region: 'seoul' },
  { code: '11215', name: '광진구', region: 'seoul' },
  { code: '11230', name: '동대문구', region: 'seoul' },
  { code: '11260', name: '중랑구', region: 'seoul' },
  { code: '11290', name: '성북구', region: 'seoul' },
  { code: '11305', name: '강북구', region: 'seoul' },
  { code: '11320', name: '도봉구', region: 'seoul' },
  { code: '11350', name: '노원구', region: 'seoul' },
  { code: '11380', name: '은평구', region: 'seoul' },
  { code: '11410', name: '서대문구', region: 'seoul' },
  { code: '11440', name: '마포구', region: 'seoul' },
  { code: '11470', name: '양천구', region: 'seoul' },
  { code: '11500', name: '강서구', region: 'seoul' },
  { code: '11530', name: '구로구', region: 'seoul' },
  { code: '11545', name: '금천구', region: 'seoul' },
  { code: '11560', name: '영등포구', region: 'seoul' },
  { code: '11590', name: '동작구', region: 'seoul' },
  { code: '11620', name: '관악구', region: 'seoul' },
  { code: '11650', name: '서초구', region: 'seoul' },
  { code: '11680', name: '강남구', region: 'seoul' },
  { code: '11710', name: '송파구', region: 'seoul' },
  { code: '11740', name: '강동구', region: 'seoul' },
  // 경기 (37)
  { code: '41111', name: '수원시 장안구', region: 'gyeonggi' },
  { code: '41113', name: '수원시 권선구', region: 'gyeonggi' },
  { code: '41115', name: '수원시 팔달구', region: 'gyeonggi' },
  { code: '41117', name: '수원시 영통구', region: 'gyeonggi' },
  { code: '41131', name: '성남시 수정구', region: 'gyeonggi' },
  { code: '41133', name: '성남시 중원구', region: 'gyeonggi' },
  { code: '41135', name: '성남시 분당구', region: 'gyeonggi' },
  { code: '41150', name: '의정부시', region: 'gyeonggi' },
  { code: '41171', name: '안양시 만안구', region: 'gyeonggi' },
  { code: '41173', name: '안양시 동안구', region: 'gyeonggi' },
  { code: '41190', name: '부천시', region: 'gyeonggi' },
  { code: '41210', name: '광명시', region: 'gyeonggi' },
  { code: '41220', name: '평택시', region: 'gyeonggi' },
  { code: '41250', name: '동두천시', region: 'gyeonggi' },
  { code: '41271', name: '안산시 상록구', region: 'gyeonggi' },
  { code: '41273', name: '안산시 단원구', region: 'gyeonggi' },
  { code: '41281', name: '고양시 덕양구', region: 'gyeonggi' },
  { code: '41285', name: '고양시 일산동구', region: 'gyeonggi' },
  { code: '41287', name: '고양시 일산서구', region: 'gyeonggi' },
  { code: '41310', name: '구리시', region: 'gyeonggi' },
  { code: '41360', name: '남양주시', region: 'gyeonggi' },
  { code: '41370', name: '오산시', region: 'gyeonggi' },
  { code: '41390', name: '시흥시', region: 'gyeonggi' },
  { code: '41410', name: '군포시', region: 'gyeonggi' },
  { code: '41430', name: '의왕시', region: 'gyeonggi' },
  { code: '41450', name: '하남시', region: 'gyeonggi' },
  { code: '41461', name: '용인시 처인구', region: 'gyeonggi' },
  { code: '41463', name: '용인시 기흥구', region: 'gyeonggi' },
  { code: '41465', name: '용인시 수지구', region: 'gyeonggi' },
  { code: '41480', name: '파주시', region: 'gyeonggi' },
  { code: '41500', name: '이천시', region: 'gyeonggi' },
  { code: '41550', name: '안성시', region: 'gyeonggi' },
  { code: '41570', name: '김포시', region: 'gyeonggi' },
  { code: '41590', name: '화성시', region: 'gyeonggi' },
  { code: '41610', name: '광주시', region: 'gyeonggi' },
  { code: '41630', name: '양주시', region: 'gyeonggi' },
  { code: '41650', name: '포천시', region: 'gyeonggi' },
  // 인천 (10)
  { code: '28110', name: '중구', region: 'incheon' },
  { code: '28140', name: '동구', region: 'incheon' },
  { code: '28177', name: '미추홀구', region: 'incheon' },
  { code: '28185', name: '연수구', region: 'incheon' },
  { code: '28200', name: '남동구', region: 'incheon' },
  { code: '28237', name: '부평구', region: 'incheon' },
  { code: '28245', name: '계양구', region: 'incheon' },
  { code: '28260', name: '서구', region: 'incheon' },
  { code: '28710', name: '강화군', region: 'incheon' },
  { code: '28720', name: '옹진군', region: 'incheon' },
]

// 2개월 전 거래년월 계산 (국토부 데이터 지연 반영)
function getDealMonth() {
  const d = new Date()
  d.setMonth(d.getMonth() - 2)
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`
}

// 국토부 API에서 거래 데이터 파싱 (XML → JSON)
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
      aptName: getTag('aptNm') || getTag('aptNm'),
      dong: getTag('umdNm'),
      dealAmount: getTag('dealAmount'),
      area: getTag('excluUseAr'),
    })
  }
  return items
}

export default async function handler(req, res) {
  // Cron 인증
  const authHeader = req.headers['authorization']
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY
  const MOLIT_API_KEY = process.env.MOLIT_API_KEY

  if (!SUPABASE_URL || !SUPABASE_KEY || !MOLIT_API_KEY) {
    return res.status(500).json({ error: 'Missing environment variables' })
  }

  try {
    const dealMonth = getDealMonth()

    // Supabase에서 이번 달에 이미 수집한 구 목록 조회
    const collectedRes = await fetch(
      `${SUPABASE_URL}/rest/v1/apartment_trades?deal_month=eq.${dealMonth}&select=district_code`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        }
      }
    )
    const collectedRows = await collectedRes.json()
    const collectedCodes = new Set(collectedRows.map(r => r.district_code))

    // 아직 수집 안 한 구 중 첫 번째
    const nextDistrict = DISTRICTS.find(d => !collectedCodes.has(d.code))

    if (!nextDistrict) {
      return res.status(200).json({
        success: true,
        message: `${dealMonth} 모든 구 수집 완료 (${DISTRICTS.length}개)`,
        collected: collectedCodes.size,
      })
    }

    // 국토부 API 호출
    const apiUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${MOLIT_API_KEY}&LAWD_CD=${nextDistrict.code}&DEAL_YMD=${dealMonth}&pageNo=1&numOfRows=1000`

    const tradeRes = await fetch(apiUrl, { timeout: 10000 })
    const xmlText = await tradeRes.text()
    const items = parseTradeXml(xmlText)

    // 아파트별 거래건수 집계
    const aptCounts = {}
    for (const item of items) {
      if (!item.aptName) continue
      if (!aptCounts[item.aptName]) {
        aptCounts[item.aptName] = { name: item.aptName, dong: item.dong, count: 0 }
      }
      aptCounts[item.aptName].count++
    }

    // Supabase에 저장
    const rows = Object.values(aptCounts).map(apt => ({
      district_code: nextDistrict.code,
      district_name: nextDistrict.name,
      apartment_name: apt.name,
      dong_name: apt.dong,
      trade_count: apt.count,
      deal_month: dealMonth,
    }))

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
        const errText = await insertRes.text()
        throw new Error(`Supabase insert failed: ${errText}`)
      }
    }

    const remaining = DISTRICTS.length - collectedCodes.size - 1
    return res.status(200).json({
      success: true,
      district: `${nextDistrict.name} (${nextDistrict.code})`,
      dealMonth,
      tradeItems: items.length,
      apartments: rows.length,
      remaining: `${remaining}개 구 남음`,
    })

  } catch (error) {
    console.error('collect-trade error:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
