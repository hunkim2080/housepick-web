import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 지역 데이터 직접 정의 (ESM 환경에서 동적 import 대신)
const regions = [
  // 서울
  { slug: 'gangnam', name: '강남', fullName: '강남구', province: '서울특별시', keywords: ['강남 줄눈', '강남구 줄눈시공', '강남 화장실 줄눈'] },
  { slug: 'gangdong', name: '강동', fullName: '강동구', province: '서울특별시', keywords: ['강동 줄눈', '강동구 줄눈시공', '강동 화장실 줄눈'] },
  { slug: 'gangbuk', name: '강북', fullName: '강북구', province: '서울특별시', keywords: ['강북 줄눈', '강북구 줄눈시공', '강북 화장실 줄눈'] },
  { slug: 'gangseo', name: '강서', fullName: '강서구', province: '서울특별시', keywords: ['강서 줄눈', '강서구 줄눈시공', '강서 화장실 줄눈'] },
  { slug: 'gwanak', name: '관악', fullName: '관악구', province: '서울특별시', keywords: ['관악 줄눈', '관악구 줄눈시공', '관악 화장실 줄눈'] },
  { slug: 'gwangjin', name: '광진', fullName: '광진구', province: '서울특별시', keywords: ['광진 줄눈', '광진구 줄눈시공', '광진 화장실 줄눈'] },
  { slug: 'guro', name: '구로', fullName: '구로구', province: '서울특별시', keywords: ['구로 줄눈', '구로구 줄눈시공', '구로 화장실 줄눈'] },
  { slug: 'geumcheon', name: '금천', fullName: '금천구', province: '서울특별시', keywords: ['금천 줄눈', '금천구 줄눈시공', '금천 화장실 줄눈'] },
  { slug: 'nowon', name: '노원', fullName: '노원구', province: '서울특별시', keywords: ['노원 줄눈', '노원구 줄눈시공', '노원 화장실 줄눈'] },
  { slug: 'dobong', name: '도봉', fullName: '도봉구', province: '서울특별시', keywords: ['도봉 줄눈', '도봉구 줄눈시공', '도봉 화장실 줄눈'] },
  { slug: 'dongdaemun', name: '동대문', fullName: '동대문구', province: '서울특별시', keywords: ['동대문 줄눈', '동대문구 줄눈시공', '동대문 화장실 줄눈'] },
  { slug: 'dongjak', name: '동작', fullName: '동작구', province: '서울특별시', keywords: ['동작 줄눈', '동작구 줄눈시공', '동작 화장실 줄눈'] },
  { slug: 'mapo', name: '마포', fullName: '마포구', province: '서울특별시', keywords: ['마포 줄눈', '마포구 줄눈시공', '마포 화장실 줄눈'] },
  { slug: 'seodaemun', name: '서대문', fullName: '서대문구', province: '서울특별시', keywords: ['서대문 줄눈', '서대문구 줄눈시공', '서대문 화장실 줄눈'] },
  { slug: 'seocho', name: '서초', fullName: '서초구', province: '서울특별시', keywords: ['서초 줄눈', '서초구 줄눈시공', '서초 화장실 줄눈'] },
  { slug: 'seongdong', name: '성동', fullName: '성동구', province: '서울특별시', keywords: ['성동 줄눈', '성동구 줄눈시공', '성동 화장실 줄눈'] },
  { slug: 'seongbuk', name: '성북', fullName: '성북구', province: '서울특별시', keywords: ['성북 줄눈', '성북구 줄눈시공', '성북 화장실 줄눈'] },
  { slug: 'songpa', name: '송파', fullName: '송파구', province: '서울특별시', keywords: ['송파 줄눈', '송파구 줄눈시공', '송파 화장실 줄눈'] },
  { slug: 'yangcheon', name: '양천', fullName: '양천구', province: '서울특별시', keywords: ['양천 줄눈', '양천구 줄눈시공', '양천 화장실 줄눈'] },
  { slug: 'yeongdeungpo', name: '영등포', fullName: '영등포구', province: '서울특별시', keywords: ['영등포 줄눈', '영등포구 줄눈시공', '영등포 화장실 줄눈'] },
  { slug: 'yongsan', name: '용산', fullName: '용산구', province: '서울특별시', keywords: ['용산 줄눈', '용산구 줄눈시공', '용산 화장실 줄눈'] },
  { slug: 'eunpyeong', name: '은평', fullName: '은평구', province: '서울특별시', keywords: ['은평 줄눈', '은평구 줄눈시공', '은평 화장실 줄눈'] },
  { slug: 'jongno', name: '종로', fullName: '종로구', province: '서울특별시', keywords: ['종로 줄눈', '종로구 줄눈시공', '종로 화장실 줄눈'] },
  { slug: 'junggu-seoul', name: '중구', fullName: '중구', province: '서울특별시', keywords: ['중구 줄눈', '서울 중구 줄눈시공', '중구 화장실 줄눈'] },
  { slug: 'jungnang', name: '중랑', fullName: '중랑구', province: '서울특별시', keywords: ['중랑 줄눈', '중랑구 줄눈시공', '중랑 화장실 줄눈'] },
  // 경기도
  { slug: 'suwon', name: '수원', fullName: '수원시', province: '경기도', keywords: ['수원 줄눈', '수원시 줄눈시공', '수원 화장실 줄눈'] },
  { slug: 'seongnam', name: '성남', fullName: '성남시', province: '경기도', keywords: ['성남 줄눈', '성남시 줄눈시공', '분당 줄눈'] },
  { slug: 'yongin', name: '용인', fullName: '용인시', province: '경기도', keywords: ['용인 줄눈', '용인시 줄눈시공', '수지 줄눈'] },
  { slug: 'bucheon', name: '부천', fullName: '부천시', province: '경기도', keywords: ['부천 줄눈', '부천시 줄눈시공', '부천 화장실 줄눈'] },
  { slug: 'ansan', name: '안산', fullName: '안산시', province: '경기도', keywords: ['안산 줄눈', '안산시 줄눈시공', '안산 화장실 줄눈'] },
  { slug: 'anyang', name: '안양', fullName: '안양시', province: '경기도', keywords: ['안양 줄눈', '안양시 줄눈시공', '평촌 줄눈'] },
  { slug: 'namyangju', name: '남양주', fullName: '남양주시', province: '경기도', keywords: ['남양주 줄눈', '남양주시 줄눈시공', '남양주 화장실 줄눈'] },
  { slug: 'hwaseong', name: '화성', fullName: '화성시', province: '경기도', keywords: ['화성 줄눈', '화성시 줄눈시공', '동탄 줄눈'] },
  { slug: 'pyeongtaek', name: '평택', fullName: '평택시', province: '경기도', keywords: ['평택 줄눈', '평택시 줄눈시공', '평택 화장실 줄눈'] },
  { slug: 'siheung', name: '시흥', fullName: '시흥시', province: '경기도', keywords: ['시흥 줄눈', '시흥시 줄눈시공', '시흥 화장실 줄눈'] },
  { slug: 'gimpo', name: '김포', fullName: '김포시', province: '경기도', keywords: ['김포 줄눈', '김포시 줄눈시공', '김포 화장실 줄눈'] },
  { slug: 'gwangmyeong', name: '광명', fullName: '광명시', province: '경기도', keywords: ['광명 줄눈', '광명시 줄눈시공', '광명 화장실 줄눈'] },
  { slug: 'gwangju-gg', name: '광주', fullName: '광주시', province: '경기도', keywords: ['광주 줄눈', '경기 광주 줄눈시공', '광주 화장실 줄눈'] },
  { slug: 'gunpo', name: '군포', fullName: '군포시', province: '경기도', keywords: ['군포 줄눈', '군포시 줄눈시공', '군포 화장실 줄눈'] },
  { slug: 'hanam', name: '하남', fullName: '하남시', province: '경기도', keywords: ['하남 줄눈', '하남시 줄눈시공', '미사 줄눈'] },
  { slug: 'osan', name: '오산', fullName: '오산시', province: '경기도', keywords: ['오산 줄눈', '오산시 줄눈시공', '오산 화장실 줄눈'] },
  { slug: 'icheon', name: '이천', fullName: '이천시', province: '경기도', keywords: ['이천 줄눈', '이천시 줄눈시공', '이천 화장실 줄눈'] },
  { slug: 'anseong', name: '안성', fullName: '안성시', province: '경기도', keywords: ['안성 줄눈', '안성시 줄눈시공', '안성 화장실 줄눈'] },
  { slug: 'uiwang', name: '의왕', fullName: '의왕시', province: '경기도', keywords: ['의왕 줄눈', '의왕시 줄눈시공', '의왕 화장실 줄눈'] },
  { slug: 'guri', name: '구리', fullName: '구리시', province: '경기도', keywords: ['구리 줄눈', '구리시 줄눈시공', '구리 화장실 줄눈'] },
  { slug: 'uijeongbu', name: '의정부', fullName: '의정부시', province: '경기도', keywords: ['의정부 줄눈', '의정부시 줄눈시공', '의정부 화장실 줄눈'] },
  { slug: 'goyang', name: '고양', fullName: '고양시', province: '경기도', keywords: ['고양 줄눈', '고양시 줄눈시공', '일산 줄눈'] },
  { slug: 'paju', name: '파주', fullName: '파주시', province: '경기도', keywords: ['파주 줄눈', '파주시 줄눈시공', '파주 화장실 줄눈'] },
  { slug: 'yangju', name: '양주', fullName: '양주시', province: '경기도', keywords: ['양주 줄눈', '양주시 줄눈시공', '양주 화장실 줄눈'] },
  { slug: 'pocheon', name: '포천', fullName: '포천시', province: '경기도', keywords: ['포천 줄눈', '포천시 줄눈시공', '포천 화장실 줄눈'] },
  { slug: 'gwacheon', name: '과천', fullName: '과천시', province: '경기도', keywords: ['과천 줄눈', '과천시 줄눈시공', '과천 화장실 줄눈'] },
  // 인천
  { slug: 'incheon', name: '인천', fullName: '인천광역시', province: '인천광역시', keywords: ['인천 줄눈', '인천 줄눈시공', '인천 화장실 줄눈'] },
]

// 템플릿 읽기
const templatePath = path.join(__dirname, '..', 'templates', 'regional.html')
const template = fs.readFileSync(templatePath, 'utf-8')

// dist 디렉토리 확인
const distPath = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(distPath)) {
  console.log('dist 폴더가 없습니다. 먼저 npm run build를 실행하세요.')
  process.exit(1)
}

// 각 지역별 HTML 생성
console.log(`${regions.length}개 지역 페이지 생성 시작...`)

regions.forEach(region => {
  const html = template
    .replace(/\{\{REGION_SLUG\}\}/g, region.slug)
    .replace(/\{\{REGION_NAME\}\}/g, region.name)
    .replace(/\{\{REGION_FULL_NAME\}\}/g, region.fullName)
    .replace(/\{\{REGION_PROVINCE\}\}/g, region.province)
    .replace(/\{\{REGION_KEYWORDS\}\}/g, region.keywords.join(', '))

  const regionDir = path.join(distPath, region.slug)
  if (!fs.existsSync(regionDir)) {
    fs.mkdirSync(regionDir, { recursive: true })
  }

  fs.writeFileSync(path.join(regionDir, 'index.html'), html)
  console.log(`  ✓ /${region.slug}/index.html 생성`)
})

console.log(`\n완료! ${regions.length}개 지역 페이지가 생성되었습니다.`)
