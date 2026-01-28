// 지역별 SEO 데이터
// 각 지역 페이지의 메타태그, JSON-LD, 콘텐츠에 사용됩니다.

export const regions = [
  // 서울
  { slug: 'gangnam', name: '강남', fullName: '강남구', province: '서울특별시', keywords: ['강남 줄눈', '강남구 줄눈시공', '강남 화장실 줄눈'], nearbyAreas: ['서초', '송파', '강동'] },
  { slug: 'gangdong', name: '강동', fullName: '강동구', province: '서울특별시', keywords: ['강동 줄눈', '강동구 줄눈시공', '강동 화장실 줄눈'], nearbyAreas: ['송파', '강남', '하남'] },
  { slug: 'gangbuk', name: '강북', fullName: '강북구', province: '서울특별시', keywords: ['강북 줄눈', '강북구 줄눈시공', '강북 화장실 줄눈'], nearbyAreas: ['도봉', '노원', '성북'] },
  { slug: 'gangseo', name: '강서', fullName: '강서구', province: '서울특별시', keywords: ['강서 줄눈', '강서구 줄눈시공', '강서 화장실 줄눈'], nearbyAreas: ['양천', '영등포', '마포'] },
  { slug: 'gwanak', name: '관악', fullName: '관악구', province: '서울특별시', keywords: ['관악 줄눈', '관악구 줄눈시공', '관악 화장실 줄눈'], nearbyAreas: ['동작', '서초', '금천'] },
  { slug: 'gwangjin', name: '광진', fullName: '광진구', province: '서울특별시', keywords: ['광진 줄눈', '광진구 줄눈시공', '광진 화장실 줄눈'], nearbyAreas: ['성동', '동대문', '중랑'] },
  { slug: 'guro', name: '구로', fullName: '구로구', province: '서울특별시', keywords: ['구로 줄눈', '구로구 줄눈시공', '구로 화장실 줄눈'], nearbyAreas: ['금천', '영등포', '양천'] },
  { slug: 'geumcheon', name: '금천', fullName: '금천구', province: '서울특별시', keywords: ['금천 줄눈', '금천구 줄눈시공', '금천 화장실 줄눈'], nearbyAreas: ['구로', '관악', '영등포'] },
  { slug: 'nowon', name: '노원', fullName: '노원구', province: '서울특별시', keywords: ['노원 줄눈', '노원구 줄눈시공', '노원 화장실 줄눈'], nearbyAreas: ['도봉', '강북', '중랑'] },
  { slug: 'dobong', name: '도봉', fullName: '도봉구', province: '서울특별시', keywords: ['도봉 줄눈', '도봉구 줄눈시공', '도봉 화장실 줄눈'], nearbyAreas: ['노원', '강북', '의정부'] },
  { slug: 'dongdaemun', name: '동대문', fullName: '동대문구', province: '서울특별시', keywords: ['동대문 줄눈', '동대문구 줄눈시공', '동대문 화장실 줄눈'], nearbyAreas: ['성북', '중랑', '광진'] },
  { slug: 'dongjak', name: '동작', fullName: '동작구', province: '서울특별시', keywords: ['동작 줄눈', '동작구 줄눈시공', '동작 화장실 줄눈'], nearbyAreas: ['관악', '서초', '영등포'] },
  { slug: 'mapo', name: '마포', fullName: '마포구', province: '서울특별시', keywords: ['마포 줄눈', '마포구 줄눈시공', '마포 화장실 줄눈'], nearbyAreas: ['서대문', '용산', '강서'] },
  { slug: 'seodaemun', name: '서대문', fullName: '서대문구', province: '서울특별시', keywords: ['서대문 줄눈', '서대문구 줄눈시공', '서대문 화장실 줄눈'], nearbyAreas: ['마포', '종로', '은평'] },
  { slug: 'seocho', name: '서초', fullName: '서초구', province: '서울특별시', keywords: ['서초 줄눈', '서초구 줄눈시공', '서초 화장실 줄눈'], nearbyAreas: ['강남', '동작', '관악'] },
  { slug: 'seongdong', name: '성동', fullName: '성동구', province: '서울특별시', keywords: ['성동 줄눈', '성동구 줄눈시공', '성동 화장실 줄눈'], nearbyAreas: ['광진', '동대문', '중구'] },
  { slug: 'seongbuk', name: '성북', fullName: '성북구', province: '서울특별시', keywords: ['성북 줄눈', '성북구 줄눈시공', '성북 화장실 줄눈'], nearbyAreas: ['동대문', '강북', '종로'] },
  { slug: 'songpa', name: '송파', fullName: '송파구', province: '서울특별시', keywords: ['송파 줄눈', '송파구 줄눈시공', '송파 화장실 줄눈'], nearbyAreas: ['강남', '강동', '하남'] },
  { slug: 'yangcheon', name: '양천', fullName: '양천구', province: '서울특별시', keywords: ['양천 줄눈', '양천구 줄눈시공', '양천 화장실 줄눈'], nearbyAreas: ['강서', '영등포', '구로'] },
  { slug: 'yeongdeungpo', name: '영등포', fullName: '영등포구', province: '서울특별시', keywords: ['영등포 줄눈', '영등포구 줄눈시공', '영등포 화장실 줄눈'], nearbyAreas: ['양천', '구로', '동작'] },
  { slug: 'yongsan', name: '용산', fullName: '용산구', province: '서울특별시', keywords: ['용산 줄눈', '용산구 줄눈시공', '용산 화장실 줄눈'], nearbyAreas: ['마포', '중구', '서초'] },
  { slug: 'eunpyeong', name: '은평', fullName: '은평구', province: '서울특별시', keywords: ['은평 줄눈', '은평구 줄눈시공', '은평 화장실 줄눈'], nearbyAreas: ['서대문', '마포', '고양'] },
  { slug: 'jongno', name: '종로', fullName: '종로구', province: '서울특별시', keywords: ['종로 줄눈', '종로구 줄눈시공', '종로 화장실 줄눈'], nearbyAreas: ['중구', '성북', '서대문'] },
  { slug: 'junggu-seoul', name: '중구', fullName: '중구', province: '서울특별시', keywords: ['중구 줄눈', '서울 중구 줄눈시공', '중구 화장실 줄눈'], nearbyAreas: ['종로', '용산', '성동'] },
  { slug: 'jungnang', name: '중랑', fullName: '중랑구', province: '서울특별시', keywords: ['중랑 줄눈', '중랑구 줄눈시공', '중랑 화장실 줄눈'], nearbyAreas: ['노원', '동대문', '광진'] },

  // 경기도
  { slug: 'suwon', name: '수원', fullName: '수원시', province: '경기도', keywords: ['수원 줄눈', '수원시 줄눈시공', '수원 화장실 줄눈'], nearbyAreas: ['용인', '화성', '오산'] },
  { slug: 'seongnam', name: '성남', fullName: '성남시', province: '경기도', keywords: ['성남 줄눈', '성남시 줄눈시공', '분당 줄눈'], nearbyAreas: ['용인', '광주', '하남'] },
  { slug: 'yongin', name: '용인', fullName: '용인시', province: '경기도', keywords: ['용인 줄눈', '용인시 줄눈시공', '수지 줄눈'], nearbyAreas: ['수원', '성남', '화성'] },
  { slug: 'bucheon', name: '부천', fullName: '부천시', province: '경기도', keywords: ['부천 줄눈', '부천시 줄눈시공', '부천 화장실 줄눈'], nearbyAreas: ['인천', '서울 강서', '김포'] },
  { slug: 'ansan', name: '안산', fullName: '안산시', province: '경기도', keywords: ['안산 줄눈', '안산시 줄눈시공', '안산 화장실 줄눈'], nearbyAreas: ['시흥', '안양', '광명'] },
  { slug: 'anyang', name: '안양', fullName: '안양시', province: '경기도', keywords: ['안양 줄눈', '안양시 줄눈시공', '평촌 줄눈'], nearbyAreas: ['군포', '의왕', '과천'] },
  { slug: 'namyangju', name: '남양주', fullName: '남양주시', province: '경기도', keywords: ['남양주 줄눈', '남양주시 줄눈시공', '남양주 화장실 줄눈'], nearbyAreas: ['구리', '서울 노원', '가평'] },
  { slug: 'hwaseong', name: '화성', fullName: '화성시', province: '경기도', keywords: ['화성 줄눈', '화성시 줄눈시공', '동탄 줄눈'], nearbyAreas: ['수원', '오산', '용인'] },
  { slug: 'pyeongtaek', name: '평택', fullName: '평택시', province: '경기도', keywords: ['평택 줄눈', '평택시 줄눈시공', '평택 화장실 줄눈'], nearbyAreas: ['오산', '안성', '천안'] },
  { slug: 'siheung', name: '시흥', fullName: '시흥시', province: '경기도', keywords: ['시흥 줄눈', '시흥시 줄눈시공', '시흥 화장실 줄눈'], nearbyAreas: ['안산', '광명', '부천'] },
  { slug: 'gimpo', name: '김포', fullName: '김포시', province: '경기도', keywords: ['김포 줄눈', '김포시 줄눈시공', '김포 화장실 줄눈'], nearbyAreas: ['부천', '인천', '서울 강서'] },
  { slug: 'gwangmyeong', name: '광명', fullName: '광명시', province: '경기도', keywords: ['광명 줄눈', '광명시 줄눈시공', '광명 화장실 줄눈'], nearbyAreas: ['서울 구로', '안양', '시흥'] },
  { slug: 'gwangju-gg', name: '광주', fullName: '광주시', province: '경기도', keywords: ['광주 줄눈', '경기 광주 줄눈시공', '광주 화장실 줄눈'], nearbyAreas: ['성남', '용인', '하남'] },
  { slug: 'gunpo', name: '군포', fullName: '군포시', province: '경기도', keywords: ['군포 줄눈', '군포시 줄눈시공', '군포 화장실 줄눈'], nearbyAreas: ['안양', '의왕', '수원'] },
  { slug: 'hanam', name: '하남', fullName: '하남시', province: '경기도', keywords: ['하남 줄눈', '하남시 줄눈시공', '미사 줄눈'], nearbyAreas: ['서울 강동', '성남', '광주'] },
  { slug: 'osan', name: '오산', fullName: '오산시', province: '경기도', keywords: ['오산 줄눈', '오산시 줄눈시공', '오산 화장실 줄눈'], nearbyAreas: ['화성', '수원', '평택'] },
  { slug: 'icheon', name: '이천', fullName: '이천시', province: '경기도', keywords: ['이천 줄눈', '이천시 줄눈시공', '이천 화장실 줄눈'], nearbyAreas: ['광주', '여주', '용인'] },
  { slug: 'anseong', name: '안성', fullName: '안성시', province: '경기도', keywords: ['안성 줄눈', '안성시 줄눈시공', '안성 화장실 줄눈'], nearbyAreas: ['평택', '용인', '이천'] },
  { slug: 'uiwang', name: '의왕', fullName: '의왕시', province: '경기도', keywords: ['의왕 줄눈', '의왕시 줄눈시공', '의왕 화장실 줄눈'], nearbyAreas: ['안양', '군포', '수원'] },
  { slug: 'guri', name: '구리', fullName: '구리시', province: '경기도', keywords: ['구리 줄눈', '구리시 줄눈시공', '구리 화장실 줄눈'], nearbyAreas: ['남양주', '서울 광진', '서울 노원'] },
  { slug: 'uijeongbu', name: '의정부', fullName: '의정부시', province: '경기도', keywords: ['의정부 줄눈', '의정부시 줄눈시공', '의정부 화장실 줄눈'], nearbyAreas: ['양주', '서울 도봉', '서울 노원'] },
  { slug: 'goyang', name: '고양', fullName: '고양시', province: '경기도', keywords: ['고양 줄눈', '고양시 줄눈시공', '일산 줄눈'], nearbyAreas: ['파주', '서울 은평', '김포'] },
  { slug: 'paju', name: '파주', fullName: '파주시', province: '경기도', keywords: ['파주 줄눈', '파주시 줄눈시공', '파주 화장실 줄눈'], nearbyAreas: ['고양', '김포', '양주'] },
  { slug: 'yangju', name: '양주', fullName: '양주시', province: '경기도', keywords: ['양주 줄눈', '양주시 줄눈시공', '양주 화장실 줄눈'], nearbyAreas: ['의정부', '동두천', '파주'] },
  { slug: 'pocheon', name: '포천', fullName: '포천시', province: '경기도', keywords: ['포천 줄눈', '포천시 줄눈시공', '포천 화장실 줄눈'], nearbyAreas: ['의정부', '양주', '남양주'] },
  { slug: 'gwacheon', name: '과천', fullName: '과천시', province: '경기도', keywords: ['과천 줄눈', '과천시 줄눈시공', '과천 화장실 줄눈'], nearbyAreas: ['안양', '서울 서초', '의왕'] },

  // 인천
  { slug: 'incheon', name: '인천', fullName: '인천광역시', province: '인천광역시', keywords: ['인천 줄눈', '인천 줄눈시공', '인천 화장실 줄눈'], nearbyAreas: ['부천', '김포', '서울'] },
]

// 지역 slug 목록 (vercel.json rewrites용)
export const regionSlugs = regions.map(r => r.slug)

// 지역 찾기 함수
export function getRegionBySlug(slug) {
  return regions.find(r => r.slug === slug)
}
