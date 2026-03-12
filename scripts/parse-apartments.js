/**
 * 아파트 엑셀 데이터 파싱 스크립트
 * 실행: node scripts/parse-apartments.js
 *
 * 6000개아파트명.xlsx → data/apartments.json 변환
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 한글 → 로마자 변환 매핑
const romanizeMap = {
  // 자음
  'ㄱ': 'g', 'ㄲ': 'kk', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'tt',
  'ㄹ': 'r', 'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'pp', 'ㅅ': 's',
  'ㅆ': 'ss', 'ㅇ': '', 'ㅈ': 'j', 'ㅉ': 'jj', 'ㅊ': 'ch',
  'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
  // 모음
  'ㅏ': 'a', 'ㅐ': 'ae', 'ㅑ': 'ya', 'ㅒ': 'yae', 'ㅓ': 'eo',
  'ㅔ': 'e', 'ㅕ': 'yeo', 'ㅖ': 'ye', 'ㅗ': 'o', 'ㅘ': 'wa',
  'ㅙ': 'wae', 'ㅚ': 'oe', 'ㅛ': 'yo', 'ㅜ': 'u', 'ㅝ': 'wo',
  'ㅞ': 'we', 'ㅟ': 'wi', 'ㅠ': 'yu', 'ㅡ': 'eu', 'ㅢ': 'ui',
  'ㅣ': 'i',
  // 종성
  'ㄳ': 'gs', 'ㄵ': 'nj', 'ㄶ': 'nh', 'ㄺ': 'lg', 'ㄻ': 'lm',
  'ㄼ': 'lb', 'ㄽ': 'ls', 'ㄾ': 'lt', 'ㄿ': 'lp', 'ㅀ': 'lh',
  'ㅄ': 'bs'
};

// 지역명 매핑
const regionMap = {
  '서울특별시': 'seoul',
  '서울시': 'seoul',
  '서울': 'seoul',
  '경기도': 'gyeonggi',
  '경기': 'gyeonggi',
  '인천광역시': 'incheon',
  '인천시': 'incheon',
  '인천': 'incheon'
};

// 서울 구별 slug 매핑
const seoulDistrictMap = {
  '종로구': 'jongno',
  '중구': 'jung',
  '용산구': 'yongsan',
  '성동구': 'seongdong',
  '광진구': 'gwangjin',
  '동대문구': 'dongdaemun',
  '중랑구': 'jungnang',
  '성북구': 'seongbuk',
  '강북구': 'gangbuk',
  '도봉구': 'dobong',
  '노원구': 'nowon',
  '은평구': 'eunpyeong',
  '서대문구': 'seodaemun',
  '마포구': 'mapo',
  '양천구': 'yangcheon',
  '강서구': 'gangseo',
  '구로구': 'guro',
  '금천구': 'geumcheon',
  '영등포구': 'yeongdeungpo',
  '동작구': 'dongjak',
  '관악구': 'gwanak',
  '서초구': 'seocho',
  '강남구': 'gangnam',
  '송파구': 'songpa',
  '강동구': 'gangdong'
};

// 경기도 시/구 매핑
const gyeonggiDistrictMap = {
  '수원시 장안구': 'suwon-jangan',
  '수원시 권선구': 'suwon-gwonseon',
  '수원시 팔달구': 'suwon-paldal',
  '수원시 영통구': 'suwon-yeongtong',
  '성남시 수정구': 'seongnam-sujeong',
  '성남시 중원구': 'seongnam-jungwon',
  '성남시 분당구': 'seongnam-bundang',
  '용인시 처인구': 'yongin-cheoin',
  '용인시 기흥구': 'yongin-giheung',
  '용인시 수지구': 'yongin-suji',
  '안양시 만안구': 'anyang-manan',
  '안양시 동안구': 'anyang-dongan',
  '안산시 상록구': 'ansan-sangnok',
  '안산시 단원구': 'ansan-danwon',
  '고양시 덕양구': 'goyang-deokyang',
  '고양시 일산동구': 'goyang-ilsandong',
  '고양시 일산서구': 'goyang-ilsanseo',
  '부천시': 'bucheon',
  '광명시': 'gwangmyeong',
  '평택시': 'pyeongtaek',
  '동두천시': 'dongducheon',
  '안성시': 'anseong',
  '김포시': 'gimpo',
  '화성시': 'hwaseong',
  '광주시': 'gwangju-gyeonggi',
  '양주시': 'yangju',
  '포천시': 'pocheon',
  '여주시': 'yeoju',
  '연천군': 'yeoncheon',
  '가평군': 'gapyeong',
  '양평군': 'yangpyeong',
  '의정부시': 'uijeongbu',
  '구리시': 'guri',
  '남양주시': 'namyangju',
  '파주시': 'paju',
  '의왕시': 'uiwang',
  '하남시': 'hanam',
  '오산시': 'osan',
  '시흥시': 'siheung',
  '군포시': 'gunpo',
  '이천시': 'icheon'
};

// 인천 구 매핑
const incheonDistrictMap = {
  '중구': 'jung',
  '동구': 'dong',
  '미추홀구': 'michuhol',
  '연수구': 'yeonsu',
  '남동구': 'namdong',
  '부평구': 'bupyeong',
  '계양구': 'gyeyang',
  '서구': 'seo',
  '강화군': 'ganghwa',
  '옹진군': 'ongjin'
};

// 브랜드 매핑
const brandMap = {
  '래미안': '삼성물산',
  '힐스테이트': '현대건설',
  '아이파크': 'HDC현대산업개발',
  '푸르지오': '대우건설',
  'e편한세상': 'DL이앤씨',
  '이편한세상': 'DL이앤씨',
  '자이': 'GS건설',
  '롯데캐슬': '롯데건설',
  '더샵': '포스코이앤씨',
  '센트레빌': '동부건설',
  '리버파크': '태영건설',
  '두산위브': '두산건설',
  '위브': '두산건설',
  '현대': '현대건설',
  '삼성': '삼성물산',
  '대우': '대우건설',
  'SK뷰': 'SK건설',
  '호반써밋': '호반건설',
  '호반': '호반건설',
  '한화포레나': '한화건설',
  '포레나': '한화건설'
};

// Phase 1: 서울 핵심구 (~460개)
const phase1Districts = ['강남구', '서초구', '송파구', '강동구', '노원구', '도봉구', '강북구', '성북구', '광진구'];
// Phase 2: 서울 나머지 + 경기 수원 (~760개)
const phase2Districts = ['마포구', '용산구', '성동구', '종로구', '중구', '서대문구', '은평구',
                          '중랑구', '동대문구', '동작구', '관악구', '금천구', '구로구', '양천구', '강서구', '영등포구'];
const phase2Cities = ['수원'];
// Phase 3: 경기 성남/용인/고양 (~640개)
const phase3Cities = ['성남', '용인', '고양'];
// Phase 4: 경기 부천/화성/남양주 (~710개)
const phase4Cities = ['부천', '화성', '남양주'];
// Phase 5: 경기 안산/안양/의정부/평택/시흥/광명/파주/김포 (~760개)
const phase5Cities = ['안산', '안양', '의정부', '평택', '시흥', '광명', '파주', '김포'];
// Phase 6: 경기 나머지 + 인천 (~860개)
const phase6Cities = ['구리', '하남', '오산', '군포', '의왕', '이천', '양주', '포천', '여주', '동두천', '안성', '광주'];

/**
 * 한글 문자열을 로마자 slug로 변환
 */
function toSlug(str) {
  if (!str) return '';

  let result = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const code = char.charCodeAt(0);

    // 한글 음절 (가-힣)
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const syllableIndex = code - 0xAC00;
      const cho = Math.floor(syllableIndex / 588);
      const jung = Math.floor((syllableIndex % 588) / 28);
      const jong = syllableIndex % 28;

      const choList = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
      const jungList = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
      const jongList = ['', 'g', 'kk', 'gs', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'b', 'bs', 's', 'ss', 'ng', 'j', 'ch', 'k', 't', 'p', 'h'];

      result += choList[cho] + jungList[jung] + jongList[jong];
    }
    // 영문, 숫자
    else if (/[a-zA-Z0-9]/.test(char)) {
      result += char.toLowerCase();
    }
    // 공백, 특수문자 → 하이픈
    else if (/[\s\-_.,()]/.test(char)) {
      if (result.length > 0 && result[result.length - 1] !== '-') {
        result += '-';
      }
    }
  }

  // 연속 하이픈 제거, 앞뒤 하이픈 제거
  return result.replace(/-+/g, '-').replace(/^-|-$/g, '');
}

/**
 * 주소에서 region/district 정보 추출
 */
function parseAddress(address) {
  if (!address) return null;

  const parts = address.split(' ').filter(p => p);
  if (parts.length < 2) return null;

  const regionStr = parts[0];
  const region = regionMap[regionStr];

  if (!region) return null; // 서울/경기/인천 외 지역 제외

  let districtName = '';
  let districtSlug = '';

  if (region === 'seoul') {
    districtName = parts[1];
    districtSlug = seoulDistrictMap[districtName];
    if (!districtSlug) {
      // 매핑에 없는 경우 자동 생성
      districtSlug = toSlug(districtName);
    }
  } else if (region === 'gyeonggi') {
    // 경기도는 주소가 "수원장안구" 처럼 붙어있는 경우가 많음
    const districtPart = parts[1];

    // "수원시 장안구" 형태로 분리 시도
    const cityMatch = districtPart.match(/^(.+시)(.+구)$/);
    if (cityMatch) {
      const cityName = cityMatch[1]; // 수원시
      const guName = cityMatch[2];   // 장안구
      districtName = `${cityName} ${guName}`;
      const mapKey = `${cityName} ${guName}`;
      districtSlug = gyeonggiDistrictMap[mapKey];
      if (!districtSlug) {
        districtSlug = toSlug(cityName) + '-' + toSlug(guName);
      }
    } else if (districtPart.endsWith('시') || districtPart.endsWith('군')) {
      // 단순 시/군
      districtName = districtPart;
      districtSlug = gyeonggiDistrictMap[districtPart];
      if (!districtSlug) {
        districtSlug = toSlug(districtPart);
      }
    } else if (parts.length >= 3 && parts[2].endsWith('구')) {
      // "경기도 수원시 장안구" 형태
      const combined = `${parts[1]} ${parts[2]}`;
      districtName = combined;
      districtSlug = gyeonggiDistrictMap[combined];
      if (!districtSlug) {
        districtSlug = toSlug(parts[1]) + '-' + toSlug(parts[2]);
      }
    } else {
      districtName = districtPart;
      districtSlug = gyeonggiDistrictMap[districtPart];
      if (!districtSlug) {
        districtSlug = toSlug(districtPart);
      }
    }
  } else if (region === 'incheon') {
    districtName = parts[1];
    districtSlug = incheonDistrictMap[districtName];
    if (!districtSlug) {
      districtSlug = toSlug(districtName);
    }
  }

  return { region, districtSlug, districtName };
}

/**
 * 브랜드 추출
 */
function extractBrand(name) {
  if (!name) return '기타';

  for (const [keyword, brand] of Object.entries(brandMap)) {
    if (name.includes(keyword)) {
      return brand;
    }
  }
  return '기타';
}

/**
 * Phase 배정 (6개 Phase로 균등 분배)
 */
function assignPhase(region, districtName) {
  if (region === 'seoul') {
    if (phase1Districts.some(d => districtName.includes(d))) return 1;
    if (phase2Districts.some(d => districtName.includes(d))) return 2;
    return 1; // 미분류 서울 구 → Phase 1
  }
  if (region === 'gyeonggi') {
    if (phase2Cities.some(c => districtName.includes(c))) return 2;
    if (phase3Cities.some(c => districtName.includes(c))) return 3;
    if (phase4Cities.some(c => districtName.includes(c))) return 4;
    if (phase5Cities.some(c => districtName.includes(c))) return 5;
    if (phase6Cities.some(c => districtName.includes(c))) return 6;
    return 6; // 경기 기타
  }
  if (region === 'incheon') return 6;
  return 6;
}

/**
 * 엑셀 날짜 숫자 → 연도 변환
 */
function excelDateToYear(excelDate) {
  if (!excelDate) return null;

  // 이미 문자열 날짜인 경우
  if (typeof excelDate === 'string') {
    const match = excelDate.match(/(\d{4})/);
    return match ? parseInt(match[1]) : null;
  }

  // 엑셀 날짜 숫자인 경우
  if (typeof excelDate === 'number') {
    // 엑셀 기준일: 1900-01-01
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.getFullYear();
  }

  return null;
}

// 메인 실행
console.log('=== 아파트 데이터 파싱 시작 ===\n');

// 1. 엑셀 읽기
const excelPath = path.join(__dirname, '..', '6000개아파트명.xlsx');
console.log(`엑셀 파일 경로: ${excelPath}`);

const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

console.log(`총 행 수: ${rows.length}\n`);

// 2. 데이터 구조 초기화
const result = {
  seoul: {},
  gyeonggi: {},
  incheon: {}
};

// slug 중복 추적
const slugCounters = {};
let duplicateCount = 0;
let brandOtherCount = 0;
let skippedCount = 0;

// 3. 각 행 처리
rows.forEach((row, index) => {
  const address = row['주소'];
  const parsed = parseAddress(address);

  if (!parsed) {
    skippedCount++;
    return;
  }

  const { region, districtSlug, districtName } = parsed;

  // 단지명 선택 (도로명주소 > 건축물대장 > 공시가격)
  const aptName = row['단지명_도로명주소'] || row['단지명_건축물대장'] || row['단지명_공시가격'];

  if (!aptName) {
    skippedCount++;
    return;
  }

  // slug 생성
  let baseSlug = toSlug(aptName);
  if (!baseSlug) {
    baseSlug = `apt-${index}`;
  }

  // 중복 체크
  const slugKey = `${region}-${districtSlug}-${baseSlug}`;
  if (slugCounters[slugKey]) {
    slugCounters[slugKey]++;
    baseSlug = `${baseSlug}-${slugCounters[slugKey]}`;
    duplicateCount++;
  } else {
    slugCounters[slugKey] = 1;
  }

  // 브랜드 추출
  const brand = extractBrand(aptName);
  if (brand === '기타') brandOtherCount++;

  // 연도 추출
  const year = excelDateToYear(row['사용승인일']);

  // 세대수
  const households = row['세대수'] || 0;

  // Phase 배정
  const phase = assignPhase(region, districtName);

  // 구조에 추가
  if (!result[region][districtSlug]) {
    result[region][districtSlug] = {
      name: districtName,
      apartments: []
    };
  }

  result[region][districtSlug].apartments.push({
    slug: baseSlug,
    name: aptName,
    households: households,
    year: year,
    brand: brand,
    phase: phase
  });
});

// 4. 통계 출력
console.log('=== 파싱 완료 통계 ===\n');

let totalCount = 0;
const regionCounts = {};

for (const [region, districts] of Object.entries(result)) {
  let regionTotal = 0;
  for (const district of Object.values(districts)) {
    regionTotal += district.apartments.length;
  }
  regionCounts[region] = regionTotal;
  totalCount += regionTotal;
}

console.log(`총 파싱된 단지 수: ${totalCount}`);
console.log(`- 서울: ${regionCounts.seoul || 0}개`);
console.log(`- 경기: ${regionCounts.gyeonggi || 0}개`);
console.log(`- 인천: ${regionCounts.incheon || 0}개`);
console.log(`\n스킵된 행 (지역 외): ${skippedCount}`);
console.log(`slug 중복 처리 건수: ${duplicateCount}`);
console.log(`브랜드 '기타' 건수: ${brandOtherCount}`);

// Phase별 통계
const phaseCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
for (const districts of Object.values(result)) {
  for (const district of Object.values(districts)) {
    for (const apt of district.apartments) {
      phaseCounts[apt.phase]++;
    }
  }
}

console.log('\n=== Phase별 단지 수 ===');
console.log(`Phase 1 (서울 핵심구): ${phaseCounts[1]}개`);
console.log(`Phase 2 (서울 나머지 + 수원): ${phaseCounts[2]}개`);
console.log(`Phase 3 (경기 성남/용인/고양): ${phaseCounts[3]}개`);
console.log(`Phase 4 (경기 부천/화성/남양주): ${phaseCounts[4]}개`);
console.log(`Phase 5 (경기 안산/안양/의정부/평택 등): ${phaseCounts[5]}개`);
console.log(`Phase 6 (경기 나머지 + 인천): ${phaseCounts[6]}개`);
console.log(`\n합계: ${Object.values(phaseCounts).reduce((a, b) => a + b, 0)}개`);

// 5. 샘플 데이터 출력
console.log('\n=== 서울 강동구 샘플 5개 ===');
const gangdongSample = result.seoul.gangdong?.apartments?.slice(0, 5) || [];
gangdongSample.forEach((apt, i) => {
  console.log(`${i + 1}. ${apt.name} (${apt.slug}) - ${apt.brand}, ${apt.year}년, ${apt.households}세대, Phase ${apt.phase}`);
});

// 6. JSON 저장
const outputPath = path.join(__dirname, '..', 'data', 'apartments.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`\n✅ 저장 완료: ${outputPath}`);
