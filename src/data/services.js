/**
 * 7개 서비스 페이지 데이터 정의
 * 각 페이지의 메타 정보, JSON-LD 스키마, 콘텐츠 데이터
 */

// 이미지 경로 상수
const BASE_URL = 'https://housepick-web.vercel.app'
const IMG_PATH = '/images/services'

// 페이지별 이미지 데이터
export const serviceImages = {
  types: {
    kerapoxy: `${IMG_PATH}/types/kerapoxy.webp`,
    polyurea: `${IMG_PATH}/types/polyurea.webp`,
    ardex: `${IMG_PATH}/types/ardex.webp`,
    biglion: `${IMG_PATH}/types/biglion.webp`,
    aspakton: `${IMG_PATH}/types/aspakton.webp`,
    starlike: `${IMG_PATH}/types/starlike-evo.webp`,
  },
  bathroom: {
    before1: `${IMG_PATH}/bathroom/bathroom-before-1.webp`,
    after1: `${IMG_PATH}/bathroom/bathroom-after-1.webp`,
    before2: `${IMG_PATH}/bathroom/bathroom-before-2.webp`,
    after2: `${IMG_PATH}/bathroom/bathroom-after-2.webp`,
    step1: `${IMG_PATH}/bathroom/process-step1.webp`,
    step2: `${IMG_PATH}/bathroom/process-step2.webp`,
    step3: `${IMG_PATH}/bathroom/process-step3.webp`,
    step4: `${IMG_PATH}/bathroom/process-step4.webp`,
  },
  price: {
    bathroomFloor: `${IMG_PATH}/price/bathroom-floor.webp`,
    bathroomFull: `${IMG_PATH}/price/bathroom-full.webp`,
    livingRoom: `${IMG_PATH}/price/living-room.webp`,
    entrance: `${IMG_PATH}/price/entrance.webp`,
    veranda: `${IMG_PATH}/price/veranda.webp`,
  },
  selfDiy: {
    selfResult: `${IMG_PATH}/self-diy/self-result.webp`,
    proResult: `${IMG_PATH}/self-diy/pro-result.webp`,
    comparison: `${IMG_PATH}/self-diy/comparison.webp`,
  },
  review: {
    review1Before: `${IMG_PATH}/review/review-1-before.webp`,
    review1After: `${IMG_PATH}/review/review-1-after.webp`,
    review2Before: `${IMG_PATH}/review/review-2-before.webp`,
    review2After: `${IMG_PATH}/review/review-2-after.webp`,
    review3Before: `${IMG_PATH}/review/review-3-before.webp`,
    review3After: `${IMG_PATH}/review/review-3-after.webp`,
  },
  find: {
    machineWork: `${IMG_PATH}/find/machine-work.webp`,
    qualityFinish: `${IMG_PATH}/find/quality-finish.webp`,
    teamPhoto: `${IMG_PATH}/find/team-photo.webp`,
  },
}

// OG 이미지 매핑
export const ogImages = {
  faq: `${BASE_URL}/images/og/og-faq.png`,
  types: `${BASE_URL}/images/og/og-types.png`,
  bathroom: `${BASE_URL}/images/og/og-bathroom.png`,
  price: `${BASE_URL}/images/og/og-price.png`,
  review: `${BASE_URL}/images/og/og-review.png`,
  'self-diy': `${BASE_URL}/images/og/og-self-diy.png`,
  find: `${BASE_URL}/images/og/og-find.png`,
}

// FAQ 페이지 Q&A 데이터 (10개)
export const faqData = [
  {
    question: "줄눈시공 비용은 얼마인가요?",
    answer: "화장실 바닥 기준 신축 30만원, 구축 35만원입니다. 전체(바닥+벽)는 신축 90만원, 구축 100만원입니다. 현관은 5~10만원, 베란다/세탁실은 15만원입니다. 하우스Pick은 정찰제라 추가 비용 없이 이 가격 그대로입니다."
  },
  {
    question: "줄눈시공 시간은 얼마나 걸리나요?",
    answer: "화장실 1개 기준 바닥만 약 2시간, 전체(바닥+벽)는 3~4시간 소요됩니다. 화장실 2개는 5~6시간, 거실은 6~8시간입니다."
  },
  {
    question: "시공 후 바로 사용할 수 있나요?",
    answer: "케라폭시 경화 시간은 24시간입니다. 6시간 후 가벼운 발걸음은 가능하지만, 물 사용은 24시간 후부터 가능합니다. 완전 경화는 48시간입니다."
  },
  {
    question: "신축과 구축 차이가 있나요?",
    answer: "신축은 깨끗한 백시멘트 상태라 바로 시공 가능합니다. 구축은 오염된 기존 줄눈을 기계로 제거하는 작업이 추가됩니다. 이로 인해 구축이 약 5만원 더 비쌉니다."
  },
  {
    question: "어떤 줄눈 자재가 좋나요?",
    answer: "화장실, 거실처럼 물을 많이 쓰거나 넓은 공간은 케라폭시(에폭시 줄눈)를 추천합니다. 현관, 베란다, 세탁실은 폴리우레아가 가성비 좋습니다. 케라폭시는 10년 이상, 폴리우레아는 5년 이상 유지됩니다."
  },
  {
    question: "셀프로 줄눈시공 할 수 있나요?",
    answer: "현관이나 베란다처럼 작은 공간은 폴리우레아로 셀프 가능합니다. 하지만 화장실이나 거실, 케라폭시 시공은 전문 업체를 추천합니다. 케라폭시는 2액형이라 배합이 어렵고, 기존 줄눈 제거도 기계가 필요합니다."
  },
  {
    question: "A/S 기간은 어떻게 되나요?",
    answer: "하우스Pick은 5년 무상 A/S입니다. 시공 후 탈락, 들뜸, 변색(시공 불량) 발생 시 무상으로 재시공해드립니다. 카카오톡으로 사진만 보내주시면 확인 후 방문합니다."
  },
  {
    question: "곰팡이가 다시 생기나요?",
    answer: "케라폭시 시공 후에는 곰팡이가 거의 발생하지 않습니다. 케라폭시는 수분을 흡수하지 않아 곰팡이가 자랄 수 없는 환경입니다. 다만 환기를 전혀 안 하면 타일 표면에 생길 수 있습니다."
  },
  {
    question: "반려동물이 있어도 안전한가요?",
    answer: "네, 안전합니다. 하우스Pick은 유해물질이 없는 친환경 줄눈재를 사용합니다. 시공 중에만 반려동물을 다른 공간에 두시고, 경화 완료(24시간) 후에는 완전히 안전합니다."
  },
  {
    question: "예약은 어떻게 하나요?",
    answer: "전화(010-6461-0131) 또는 채널톡으로 상담 후 예약하시면 됩니다. 시공 희망일 기준 3~5일 전에 예약해주시면 원하시는 날짜에 시공 가능합니다. 주말 시공도 가능합니다."
  }
];

// 리뷰 데이터
export const reviewsData = [
  {
    author: "김** 고객",
    date: "2025-01-15",
    rating: 5,
    text: "시간 약속도 잘 지켜주시고 일 처리도 꼼꼼히 잘 해주셔서 최종 결과물이 아주 만족스러웠습니다. 지인 소개 적극 추천 예정입니다!",
    location: "서울 강남구",
    space: "화장실 2개",
    cost: "55만원"
  },
  {
    author: "이** 고객",
    date: "2025-01-10",
    rating: 5,
    text: "견적 받았을 때 타업체보다 저렴해서 반신반의였는데, 줄눈하고 나니 새집이 더 새집같아졌습니다!",
    location: "경기 수원시",
    space: "화장실 전체",
    cost: "90만원"
  },
  {
    author: "박** 고객",
    date: "2025-01-05",
    rating: 5,
    text: "견적제시 업체 중 가장 정확하게 견적을 제시했어요. 색상 제안도 예쁘고 작업도 꼼꼼하고 완벽해서 가족들에게 추천하고 싶어요!",
    location: "경기 성남시",
    space: "화장실 바닥",
    cost: "35만원"
  }
];

// 7개 서비스 페이지 정의
export const servicePages = {
  faq: {
    slug: 'faq',
    url: '/faq',
    title: '케라폭시 폴리우레아 반짝이 줄눈시공 Q&A | 경화시간, 비용, 시간 총정리',
    description: '시공 2~3시간, 경화 24시간, 화장실 바닥 30만원. 애완동물 안전할까? 신축이랑 구축 차이는? 줄눈시공 전 꼭 알아야 할 질문 BEST 10.',
    keywords: '줄눈시공질문, 줄눈FAQ, 줄눈시공궁금, 줄눈비용, 줄눈시간, 케라폭시, 폴리우레아',
    h1: '줄눈시공 Q&A | 경화시간, 비용, 시간 총정리',
    subtitle: '시공 2~3시간, 경화 24시간. 줄눈시공 전 꼭 알아야 할 질문들',
    schemaType: 'FAQPage',
    priority: 1
  },
  types: {
    slug: 'types',
    url: '/types',
    title: '케라폭시 폴리우레아 빅라이언 아덱스 줄눈등 종류 6가지 비교 | 케라폭시 vs 폴리우레아',
    description: '케라폭시, 폴리우레아, 아덱스, 빅라이언 장단점 비교. 화장실엔 뭐가 좋을까? 공간별 추천 자재 가이드.',
    keywords: '줄눈종류, 케라폭시줄눈, 폴리우레아줄눈, 아덱스줄눈, 빅라이언줄눈, 아스팍톤줄눈, 스타라이크에보줄눈',
    h1: '줄눈 종류 6가지 비교 | 케라폭시 vs 폴리우레아',
    subtitle: '화장실엔 뭐가 좋을까? 공간별 추천 자재 가이드',
    schemaType: 'Article',
    priority: 2
  },
  bathroom: {
    slug: 'bathroom',
    url: '/bathroom',
    title: '화장실 줄눈시공 가이드 | 2~3시간 완료',
    description: '신축 30만원, 구축 35만원. 시공 과정 5단계, 자재 선택법, 주의사항까지. 화장실 줄눈 바꾸기 전 필독.',
    keywords: '화장실줄눈, 화장실줄눈시공, 욕실줄눈, 화장실줄눈가격, 구축화장실줄눈, 신축화장실줄눈',
    h1: '화장실 줄눈시공 가이드 | 2~3시간 완료',
    subtitle: '신축 30만원, 구축 35만원. 시공 과정 5단계 완벽 정리',
    schemaType: 'HowTo',
    priority: 3
  },
  price: {
    slug: 'price',
    url: '/price',
    title: '2026 케라폭시 폴리우레아 줄눈시공 가격표 | 화장실 30만원~',
    description: '화장실 바닥 30만원, 전체 90만원, 거실 150만원, 현관 5만원. 신축/구축 가격 차이, 세트 할인까지 총정리.',
    keywords: '줄눈시공가격, 줄눈가격, 줄눈비용, 화장실줄눈가격, 거실줄눈가격, 케라폭시가격',
    h1: '2026 줄눈시공 가격표 | 화장실 30만원~',
    subtitle: '화장실 바닥 30만원, 전체 90만원, 거실 150만원, 현관 5만원',
    schemaType: 'Product',
    priority: 4
  },
  review: {
    slug: 'review',
    url: '/review',
    title: '줄눈시공 실제 후기 | 평점 4.9/5.0',
    description: '강남, 수원, 성남 고객 실제 후기. Before/After 사진으로 확인하세요. 1,273건 리뷰 평균 4.9점.',
    keywords: '줄눈시공후기, 줄눈업체후기, 줄눈시공전후, 케라폭시후기, 줄눈시공사진',
    h1: '줄눈시공 실제 후기 | 평점 4.9/5.0',
    subtitle: '강남, 수원, 성남 고객 실제 후기. Before/After 사진으로 확인하세요.',
    schemaType: 'LocalBusiness',
    priority: 5
  },
  'self-diy': {
    slug: 'self-diy',
    url: '/self-diy',
    title: '셀프 줄눈 vs 업체 시공 | 뭐가 이득일까?',
    description: '셀프 3~5만원 vs 업체 30만원. 근데 셀프는 왜 후회할까? 비용, 난이도, 결과물 솔직 비교.',
    keywords: '셀프줄눈시공, 줄눈셀프, 셀프줄눈후기, DIY줄눈, 줄눈시공방법',
    h1: '셀프 줄눈 vs 업체 시공 | 뭐가 이득일까?',
    subtitle: '셀프 3~5만원 vs 업체 30만원. 비용, 난이도, 결과물 솔직 비교',
    schemaType: 'Article',
    priority: 6
  },
  find: {
    slug: 'find',
    url: '/find',
    title: '좋은 케라폭시 줄눈업체 고르는 법 5가지 체크리스트',
    description: '기계 제거하는지? 보증서 주는지? 바가지 안 쓰는 업체 선택 기준. 피해야 할 업체 특징까지.',
    keywords: '줄눈업체추천, 줄눈전문업체, 줄눈업체고르는법, 줄눈시공업체, 구축줄눈업체, 신축줄눈업체',
    h1: '좋은 줄눈업체 고르는 법 5가지 체크리스트',
    subtitle: '기계 제거하는지? 보증서 주는지? 바가지 안 쓰는 업체 선택 기준',
    schemaType: 'Article',
    priority: 7
  }
};

// slug로 서비스 페이지 가져오기
export function getServiceBySlug(slug) {
  return servicePages[slug] || null;
}

// 모든 서비스 페이지 목록
export function getAllServices() {
  return Object.values(servicePages);
}

// JSON-LD 스키마 생성 함수들
export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

export function generateArticleSchema(service) {
  // 페이지별 대표 이미지 매핑
  const articleImages = {
    types: `${BASE_URL}${serviceImages.types.kerapoxy}`,
    'self-diy': `${BASE_URL}${serviceImages.selfDiy.comparison}`,
    find: `${BASE_URL}${serviceImages.find.qualityFinish}`,
  };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": service.h1,
    "description": service.description,
    "image": articleImages[service.slug] || `${BASE_URL}/images/og/og-template.png`,
    "author": {
      "@type": "Organization",
      "name": "하우스Pick"
    },
    "publisher": {
      "@type": "Organization",
      "name": "하우스Pick",
      "logo": {
        "@type": "ImageObject",
        "url": "https://housepick-web.vercel.app/images/logo.png"
      }
    },
    "datePublished": "2025-01-29",
    "dateModified": "2025-01-29"
  };
}

export function generateHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "화장실 줄눈시공 방법",
    "description": "화장실 줄눈시공의 전체 과정을 단계별로 안내합니다.",
    "image": `${BASE_URL}${serviceImages.bathroom.after1}`,
    "totalTime": "PT4H",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "KRW",
      "value": "300000-1000000"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "현장 확인 및 준비",
        "text": "타일 상태와 기존 줄눈 상태를 확인하고 시공 준비를 합니다.",
        "image": `${BASE_URL}${serviceImages.bathroom.before1}`,
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "기존 줄눈 제거",
        "text": "전용 기계로 기존 백시멘트 또는 오염된 줄눈을 제거합니다.",
        "image": `${BASE_URL}${serviceImages.bathroom.step1}`,
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "청소 및 건조",
        "text": "먼지와 이물질을 제거하고 완전히 건조시킵니다.",
        "image": `${BASE_URL}${serviceImages.bathroom.step2}`,
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "케라폭시 시공",
        "text": "에폭시 줄눈재를 배합하여 틈새에 채워넣습니다.",
        "image": `${BASE_URL}${serviceImages.bathroom.step3}`,
        "position": 4
      },
      {
        "@type": "HowToStep",
        "name": "마무리 및 경화",
        "text": "표면을 정리하고 24시간 경화 시간을 둡니다.",
        "image": `${BASE_URL}${serviceImages.bathroom.step4}`,
        "position": 5
      }
    ]
  };
}

export function generateProductSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "줄눈시공 서비스",
    "description": "화장실, 거실, 현관 등 공간별 줄눈시공 서비스",
    "brand": {
      "@type": "Brand",
      "name": "하우스Pick"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "50000",
      "highPrice": "1500000",
      "priceCurrency": "KRW",
      "offerCount": "10"
    }
  };
}

export function generateReviewSchema() {
  const reviewImages = [
    `${BASE_URL}${serviceImages.review.review1After}`,
    `${BASE_URL}${serviceImages.review.review2After}`,
    `${BASE_URL}${serviceImages.review.review3After}`
  ];

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "하우스Pick",
    "description": "정찰제 줄눈시공 전문업체",
    "image": `${BASE_URL}${serviceImages.review.review1After}`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviewsData.slice(0, 3).map((review, index) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.date,
      "reviewBody": review.text,
      "image": reviewImages[index],
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString()
      }
    }))
  };
}

// 서비스 페이지 타입에 따른 JSON-LD 스키마 생성
export function generateSchema(service) {
  switch (service.schemaType) {
    case 'FAQPage':
      return generateFAQSchema();
    case 'HowTo':
      return generateHowToSchema();
    case 'Product':
      return generateProductSchema();
    case 'LocalBusiness':
      return generateReviewSchema();
    case 'Article':
    default:
      return generateArticleSchema(service);
  }
}

// BreadcrumbList 스키마 생성
export function generateBreadcrumbSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://housepick-web.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": service.h1,
        "item": `https://housepick-web.vercel.app${service.url}`
      }
    ]
  };
}
