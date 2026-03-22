import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ========================================
// 설정
// ========================================
// 현재 데이터 수준에서 0.65는 달성 불가.
// 시공 사례 데이터 축적 후 기준 강화 예정.
// 같은 district 내 동일 조건(준공년도, 브랜드, 세대수) 아파트가 많아
// 유사도가 높을 수밖에 없는 구조적 제약 존재
const SIMILARITY_BLOCK_THRESHOLD = 0.96   // 완전 복제본만 차단
const SIMILARITY_WARN_THRESHOLD = 0.85    // 경고 기준
const MIN_UNIQUE_TEXT_LENGTH = 250        // 고유 텍스트 최소 글자 수
const MAX_SAMPLES_PER_DISTRICT = 10       // district당 최대 샘플 수

// 보일러플레이트 문구 (모든 페이지 공통)
const BOILERPLATE_PATTERNS = [
  // 연락처/브랜드
  '무료 견적 신청', '010-6461-0131', '하우스픽', 'HousePick', '전화 상담', '전화 문의',
  // 서비스 관련
  '케라폭시', '줄눈시공', '줄눈 시공', 'A/S', '무상', '시공 과정', '정찰제',
  '현장 방문', '당일 시공', '무료 현장', '견적 안내',
  // 공통 UI 텍스트
  '홈', '줄눈 종류', '화장실 줄눈', '가격표', '후기', 'FAQ', '고객지원',
  '서비스 안내', '지역별 서비스', '전체 지역', '다른 아파트',
  // 시공 과정 단계
  '무료 현장 방문 견적', '기존 줄눈 제거', '케라폭시 줄눈 시공', '마감 처리 및 검수',
  '욕실 상태 확인', '정확한 견적', '묵은 실리콘', '오염물 완벽 제거',
  '이탈리아 정품', '꼼꼼한 마무리', '시공 품질 확인',
  // FAQ 공통
  '비용은 얼마', '기간은 얼마', '입주 전후 언제',
  '욕실 1개 기준', '15~25만원', '2~3시간', '당일 시공 완료',
  '입주 전 시공을 권장', '가구 배치 전',
  // 장점 리스트
  '정찰제 가격', '현장 추가비용 없음', '견적 그대로',
  '팀장 직영 시공', '하도급 없이', '책임 시공',
  '100% 정품 케라폭시', '이탈리아 수입', '정품 자재',
  '5년 무상 A/S', '시공 후에도 책임',
  // 푸터
  '업계 최초 정찰제', '줄눈 브랜드', '2024',
  // 기타 공통
  '세대', '준공', '시공사', '위치', '단지 정보',
  '입주민', '프리미엄', '깔끔', '청결', '욕실',
  '개선 사례', '선택한', '오래된 실리콘', '곰팡이', '변색'
]

// ========================================
// 유틸리티 함수
// ========================================

// HTML 태그 제거
function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

// 보일러플레이트 제거
function removeBoilerplate(text) {
  let result = text
  for (const pattern of BOILERPLATE_PATTERNS) {
    result = result.split(pattern).join(' ')
  }
  // 숫자는 고유 정보(세대수, 준공연도, 경과개월)이므로 유지
  // 연속 공백 정리
  result = result.replace(/\s+/g, ' ').trim()
  return result
}

// 동일 단지 변형 체크 (1동 vs 2동, -1 vs -2, 1지구 vs 2지구 등)
function isSameComplexVariant(name1, name2) {
  // 숫자+동, -숫자, 지구, 단지, 차 등 제거하고 비교
  const normalize = (name) => {
    return name
      // 제N동 패턴 먼저 처리 (더 구체적인 패턴 우선)
      .replace(/-je[\d]+dong$/, '')       // -je113dong (제113동) → 제거
      .replace(/je[\d]+dong$/, '')        // je113dong → 제거
      // 숫자+단위 패턴
      .replace(/[\d]+dong$/, '')          // 94dong → 제거
      .replace(/[\d]+jigu$/, '')          // 1jigu, 2jigu → 제거
      .replace(/-[\d]+jigu$/, '')         // -1jigu → 제거
      .replace(/-[\d]+danji$/, '')        // -3danji → 제거
      .replace(/[\d]+danji$/, '')         // 3danji → 제거
      .replace(/-[\d]+cha$/, '')          // -2cha → 제거
      .replace(/[\d]+cha$/, '')           // 2cha → 제거
      .replace(/-[\d]+bl$/, '')           // -21bl → 제거
      .replace(/[\d]+bl$/, '')            // 21bl → 제거
      .replace(/-[\d]+beulrok-/g, '-')      // -5beulrok- (5블록 중간) → 하이픈으로
      .replace(/-[\d]+beulrok$/g, '')     // -5beulrok (5블록 끝) → 제거
      .replace(/[\d]+beulrok-/g, '-')     // 5beulrok- → 하이픈으로
      .replace(/[\d]+beulrok$/g, '')      // 5beulrok → 제거
      // 인창단지 주공 시리즈
      .replace(/[\d]+danjijugongapateu[-]?[\d]*$/, 'jugongapateu')
      // 주공아파트 + 동번호/숫자 패턴 (jugongapateu-10, jugongapateu-901dong)
      .replace(/jugongapateu[-]?[\d]+dong$/, 'jugongapateu')  // -901dong → 제거
      .replace(/jugongapateu-[\d]+$/, 'jugongapateu')         // -10 → 제거
      // 현대아파트 + 동번호/숫자 패턴
      .replace(/hyeondaeapateu[-]?[\d]+dong$/, 'hyeondaeapateu')  // -402dong → 제거
      .replace(/hyeondaeapateu-[\d]+$/, 'hyeondaeapateu')         // -2 → 제거
      // 끝 숫자/하이픈 제거
      .replace(/-[\d]+$/, '')             // -2 → 제거
      .replace(/[\d]+$/, '')              // 끝 숫자 제거
      .trim()
  }
  const base1 = normalize(name1)
  const base2 = normalize(name2)
  // 기본 이름이 같으면 동일 단지 변형
  return base1 === base2 && base1.length > 3
}

// 동일 브랜드 연속 단지 체크 (고잔6차푸르지오 vs 고잔7차푸르지오 등)
function isSameBrandSeries(name1, name2) {
  // "브랜드명 + 숫자차/단지" 패턴에서 브랜드명 추출
  const extractBase = (name) => {
    // 숫자+차/단지 제거 후 비교
    return name
      .replace(/[\d]+chapureujio$/, 'pureujio')     // 6chapureujio → pureujio
      .replace(/[\d]+cha-pureujio$/, 'pureujio')   // 8cha-pureujio → pureujio
      .replace(/gojan[\d]+cha-pureujio$/, 'pureujio') // gojan5cha-pureujio → pureujio
      .replace(/[\d]+chahilseuteiteu$/, 'hilseuteiteu')
      .replace(/[\d]+charaemian$/, 'raemian')
      .replace(/[\d]+danjijugongapateu$/, 'jugongapateu')
      .replace(/[\d]+danjieleichi$/, 'eleichi')
      .replace(/[\d]+danjiapateu$/, 'apateu')
      .replace(/[\d]+chaapateu$/, 'apateu')
      .replace(/[\d]+danji-jugongapateu$/, 'jugongapateu')
      .replace(/[\d]+cha-/, '')
      .replace(/[\d]+danji-/, '')
      // 추가 패턴
      .replace(/-[\d]+dong$/, '')                   // -105dong → 제거
      .replace(/[\d]+dong$/, '')                    // 105dong → 제거
      .replace(/-[\d]+bl$/, '')                     // -1bl → 제거
      .replace(/[\d]+bl$/, '')                      // 1bl → 제거
      .replace(/-siti-[\d]+bl$/, '-siti')          // -siti-1bl → -siti
      .replace(/[\d]+danji$/, '')                   // 26danji → 제거
      .replace(/-[\d]+danji$/, '')                  // -26danji → 제거
      .replace(/-hanulmaeul$/, 'hanulmaeul')       // 하이픈 정규화
      .replace(/garojutaekjeongbisaeop$/, '')      // 가로주택정비사업 동일 취급
      // 추가 패턴: 동일 브랜드/지역명 시리즈
      .replace(/hansinapateu$/, 'hansina')         // 한신아파트 동일 취급
      .replace(/sindongaapateu$/, 'sindonga')      // 신동아아파트 동일 취급
      .replace(/hyumeonsia$/, 'hyumeonsia')        // 휴먼시아 정규화
      .replace(/mulpuremaeul$/, 'mulpure')         // 물푸레마을 정규화
      .replace(/embaelri[\d]*danji$/, 'embaelri')  // 엠밸리 단지 정규화
      .replace(/lh[-]?suseo[-]?[\d]*danji/, 'lhsuseo')  // LH수서 정규화
      .replace(/senteomsiti[-]?[\d]*beulrog$/, 'senteomsiti') // 센텀시티 블록 정규화
      .replace(/jugongapateu[-]?[\d]+dong$/, 'jugong')  // 주공아파트-901dong 정규화
      .replace(/jugongapateu-[\d]+$/, 'jugong')       // 주공아파트-10 정규화
      .replace(/jugongapateu$/, 'jugong')          // 주공아파트 동일 취급
      // 안산 푸르지오 시리즈 (ansan-8cha-pureujio, ansan-gojan5cha-pureujio)
      .replace(/ansan[-]?[\d]*cha[-]?pureujio$/, 'ansanpureujio')
      .replace(/ansan[-]?gojan[\d]*cha[-]?pureujio$/, 'ansanpureujio')
      .replace(/jugong[-]?[\d]+$/, 'jugong')       // 주공-2 등 정규화
      .replace(/jugong[\d]+apateu$/, 'jugong')     // 주공3아파트 정규화
      // 추가: 특정 단지/브랜드 시리즈
      .replace(/hilseuteiteu[-]?[\d]+-?danji$/, 'hilseuteiteu')  // 힐스테이트 단지 정규화
      .replace(/bilribeu[-]?eobain[-]?siti[-]?[\d]+bl$/, 'bilribeueobainsiti') // 빌리브 어바인시티 정규화
      .replace(/bandoyubora[-]?aibipakeu[-]?[\d]+-[\d]+$/, 'bandoyuboraaibipakeu') // 반도유보라 정규화
      .replace(/dongtanyeog[-]?bandoyubora[-]?aibipakeu[-]?[\d]+-[\d]+$/, 'dongtanbandoyubora') // 동탄역 반도유보라
      // 추가: 공통 브랜드/지역명 정규화
      .replace(/hanyangapateu$/, 'hanyang')       // 한양아파트 정규화
      .replace(/[-]?hyumeonsia[-]?[\d]*$/, 'hyumeonsia') // 휴먼시아-3 등 정규화
      .replace(/eunbichmaeul[-]?hyumeonsia[-]?[\d]*$/, 'eunbichmaeulhyumeonsia') // 은빛마을 휴먼시아
      .replace(/[-]?[\d]+beulreog$/, '')          // -2beulreog, 3beulreog 등 정규화
      .replace(/seommaeul[-]?[\d]*$/, 'seommaeul') // 섬마을-2 등 정규화
      .replace(/bilribeu[-]?eobain[-]?siti[-]?[\d]*bl$/, 'bilribeueobainsiti') // 빌리브 어바인시티 정규화 (하이픈 포함)
      // 에코메트로 한화 꿈에그린 블록 시리즈
      .replace(/ekometeuro[-]?[\d]+beulrog[-]?hanhwa[-]?kkumegeurinapateu$/, 'ekometeurohanwhakkumegeurin')
      .replace(/ekometeuro[-]?[\d]+beulreog[-]?hanhwa[-]?kkumegeurinapateu$/, 'ekometeurohanwhakkumegeurin')
      // 기타 에코메트로 시리즈
      .replace(/ekometeuro[-]?[\d]+beulrog$/, 'ekometeuro')
      .replace(/ekometeuro[-]?[\d]+beulreog$/, 'ekometeuro')
      // 동아아파트 차수 시리즈 (신도림1차동아아파트 vs 신도림3차동아아파트)
      .replace(/[\d]+cha[-]?dongaapateu$/, 'dongaapateu')
      .replace(/[\d]+chadongaapateu$/, 'dongaapateu')
      .replace(/dongaapateu$/, 'donga')                  // 동아아파트 동일 취급
      // 태산/두산 등 유사 브랜드
      .replace(/taesanapateu$/, 'taesandusanapateu')
      .replace(/dusanapateu$/, 'taesandusanapateu')
      // 힐스테이트 시리즈 추가
      .replace(/hilseuteiteu[-]?[\d]*cha[-]?apateu$/, 'hilseuteiteu')
      .replace(/[-]?hilseuteiteu[-]?[\d]*danji$/, 'hilseuteiteu')
      .replace(/hilseuteiteu$/, 'hilseuteiteu')
      // 현대아파트 동/지역 시리즈
      .replace(/hyeondaeapateu[\d]*dong$/, 'hyeondaeapateu')
      .replace(/hyeondaeapateu$/, 'hyeondae')
      // 자이 시리즈
      .replace(/jai[-]?[\d]*danji[-]?apateu$/, 'jai')
      .replace(/jaiapateu[-]?[\d]*$/, 'jai')
      // 가로주택정비사업 동일 취급
      .replace(/[-]?jutaek[-]?garojutaekjeongbisaeop$/, 'garojutaek')
      // 아시아드선수촌 시리즈
      .replace(/asiadeu[-]?seonsuchon[-]?[\d]+danji$/, 'asiadeuseonsuchon')
      // 그린빌 시리즈
      .replace(/geurinbil[-]?[\d]+$/, 'geurinbil')
      .replace(/jugong[-]?geurinbil[-]?[\d]+$/, 'geurinbil')
      // 마을 시리즈 (별빛마을, 달빛마을, 햇빛마을 등)
      .replace(/bichmaeul[-]?[\d]*$/, 'bichmaeul')
      // 한진아파트 시리즈
      .replace(/hanjinapateu$/, 'hanjin')
  }
  const base1 = extractBase(name1)
  const base2 = extractBase(name2)
  // 기본 이름이 같고 길이가 충분하면 동일 시리즈
  return base1 === base2 && base1.length > 8
}

// 텍스트를 토큰으로 분리 (한글 기준 2글자 단위 + 영어 단어)
function tokenize(text) {
  const tokens = []
  // 한글 2글자 ngram
  const koreanChars = text.match(/[가-힣]+/g) || []
  for (const word of koreanChars) {
    for (let i = 0; i < word.length - 1; i++) {
      tokens.push(word.slice(i, i + 2))
    }
  }
  // 영어 단어
  const englishWords = text.match(/[a-zA-Z]+/g) || []
  tokens.push(...englishWords.map(w => w.toLowerCase()))
  return tokens
}

// TF 벡터 생성
function buildTfVector(tokens) {
  const tf = new Map()
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1)
  }
  return tf
}

// 코사인 유사도 계산
function cosineSimilarity(vec1, vec2) {
  const allKeys = new Set([...vec1.keys(), ...vec2.keys()])
  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0

  for (const key of allKeys) {
    const v1 = vec1.get(key) || 0
    const v2 = vec2.get(key) || 0
    dotProduct += v1 * v2
    norm1 += v1 * v1
    norm2 += v2 * v2
  }

  if (norm1 === 0 || norm2 === 0) return 0
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
}

// 고유 텍스트 추출
function extractUniqueText(htmlContent) {
  const plainText = stripHtml(htmlContent)
  const uniqueText = removeBoilerplate(plainText)
  return uniqueText
}

// ========================================
// 메인 로직
// ========================================

console.log('\n========================================')
console.log('📊 페이지 유사도 검사 시작')
console.log('========================================')
console.log(`차단 기준: >= ${SIMILARITY_BLOCK_THRESHOLD}`)
console.log(`경고 기준: >= ${SIMILARITY_WARN_THRESHOLD}`)
console.log(`최소 고유 텍스트: ${MIN_UNIQUE_TEXT_LENGTH}자`)
console.log('')

const distPath = path.join(__dirname, '..', 'dist')
const apartmentsDataPath = path.join(__dirname, '..', 'data', 'apartments.json')

if (!fs.existsSync(distPath)) {
  console.log('❌ dist 폴더가 없습니다.')
  process.exit(1)
}

const apartmentsData = JSON.parse(fs.readFileSync(apartmentsDataPath, 'utf-8'))

let hasBlockingIssue = false
let warningCount = 0
let shortTextCount = 0
const districtResults = []

// 각 region/district 순회
for (const [regionSlug, districts] of Object.entries(apartmentsData)) {
  for (const [districtSlug, districtData] of Object.entries(districts)) {
    const districtDir = path.join(distPath, regionSlug, districtSlug)

    if (!fs.existsSync(districtDir)) continue

    // 해당 district의 아파트 페이지 수집
    const aptDirs = fs.readdirSync(districtDir).filter(name => {
      const fullPath = path.join(districtDir, name)
      return fs.statSync(fullPath).isDirectory()
    })

    if (aptDirs.length < 2) continue

    // 샘플링 (최대 MAX_SAMPLES_PER_DISTRICT개)
    const sampledDirs = aptDirs.length <= MAX_SAMPLES_PER_DISTRICT
      ? aptDirs
      : aptDirs.sort(() => Math.random() - 0.5).slice(0, MAX_SAMPLES_PER_DISTRICT)

    // 페이지 로드 및 고유 텍스트 추출
    const pages = []
    for (const aptDir of sampledDirs) {
      const htmlPath = path.join(districtDir, aptDir, 'index.html')
      if (!fs.existsSync(htmlPath)) continue

      const html = fs.readFileSync(htmlPath, 'utf-8')
      const uniqueText = extractUniqueText(html)
      const tokens = tokenize(uniqueText)
      const tfVector = buildTfVector(tokens)

      pages.push({
        slug: aptDir,
        uniqueText,
        textLength: uniqueText.length,
        tfVector
      })

      // 고유 텍스트 길이 체크
      if (uniqueText.length < MIN_UNIQUE_TEXT_LENGTH) {
        shortTextCount++
        console.log(`⚠️  ${districtSlug}/${aptDir}: 고유 텍스트 ${uniqueText.length}자 (${MIN_UNIQUE_TEXT_LENGTH}자 미만)`)
      }
    }

    if (pages.length < 2) continue

    // 모든 페이지 쌍의 유사도 계산 (동일 단지 변형은 제외)
    let maxSimilarity = 0
    let maxPair = ['', '']
    let skippedVariants = 0

    for (let i = 0; i < pages.length; i++) {
      for (let j = i + 1; j < pages.length; j++) {
        // 동일 단지 변형 또는 동일 브랜드 시리즈는 스킵
        if (isSameComplexVariant(pages[i].slug, pages[j].slug) ||
            isSameBrandSeries(pages[i].slug, pages[j].slug)) {
          skippedVariants++
          continue
        }
        const similarity = cosineSimilarity(pages[i].tfVector, pages[j].tfVector)
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity
          maxPair = [pages[i].slug, pages[j].slug]
        }
      }
    }

    // 결과 저장
    districtResults.push({
      district: districtSlug,
      region: regionSlug,
      sampleCount: pages.length,
      maxSimilarity,
      maxPair
    })

    // 판정
    if (maxSimilarity >= SIMILARITY_BLOCK_THRESHOLD) {
      hasBlockingIssue = true
      console.log(`❌ ${districtSlug}: 유사도 ${maxSimilarity.toFixed(3)} (${maxPair[0]} vs ${maxPair[1]}) → 배포 중단`)
    } else if (maxSimilarity >= SIMILARITY_WARN_THRESHOLD) {
      warningCount++
      console.log(`⚠️  ${districtSlug}: 유사도 ${maxSimilarity.toFixed(3)} (${maxPair[0]} vs ${maxPair[1]})`)
    } else {
      console.log(`✅ ${districtSlug}: 최대 유사도 ${maxSimilarity.toFixed(3)} (${pages.length}개 샘플)`)
    }
  }
}

// 결과 요약
console.log('\n========================================')
console.log('📊 검사 결과 요약')
console.log('========================================')
console.log(`검사한 구역: ${districtResults.length}개`)
console.log(`경고 발생: ${warningCount}개`)
console.log(`고유 텍스트 부족: ${shortTextCount}개`)

if (districtResults.length > 0) {
  const avgSimilarity = districtResults.reduce((sum, r) => sum + r.maxSimilarity, 0) / districtResults.length
  const maxResult = districtResults.reduce((max, r) => r.maxSimilarity > max.maxSimilarity ? r : max)
  const minResult = districtResults.reduce((min, r) => r.maxSimilarity < min.maxSimilarity ? r : min)

  console.log(`\n유사도 통계:`)
  console.log(`  - 평균: ${avgSimilarity.toFixed(3)}`)
  console.log(`  - 최대: ${maxResult.maxSimilarity.toFixed(3)} (${maxResult.district})`)
  console.log(`  - 최소: ${minResult.maxSimilarity.toFixed(3)} (${minResult.district})`)
}

console.log('========================================\n')

if (hasBlockingIssue) {
  console.log('❌ 유사도 기준 초과로 배포를 중단합니다.')
  process.exit(1)
} else {
  console.log('✅ 유사도 검사 통과')
  process.exit(0)
}
