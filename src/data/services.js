/**
 * 7개 서비스 페이지 데이터 정의
 * 각 페이지의 메타 정보, JSON-LD 스키마, 콘텐츠 데이터
 */

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
    title: '줄눈시공 자주 묻는 질문 BEST 10 - 가격, 시간, A/S 총정리 | 하우스Pick',
    description: '줄눈시공 궁금한 점 총정리. 비용, 시공 시간, 경화 시간, A/S, 자재 차이 등 가장 많이 묻는 질문 10가지를 정리했습니다.',
    keywords: '줄눈시공질문, 줄눈FAQ, 줄눈시공궁금, 줄눈비용, 줄눈시간',
    h1: '줄눈시공 자주 묻는 질문 BEST 10',
    subtitle: '고객님들이 가장 많이 묻는 질문 10가지를 정리했습니다.',
    schemaType: 'FAQPage',
    priority: 1
  },
  types: {
    slug: 'types',
    url: '/types',
    title: '줄눈 종류 완벽 비교 가이드 (2025) - 케라폭시, 폴리우레아, 아덱스 | 하우스Pick',
    description: '케라폭시, 폴리우레아, 아덱스, 빅라이언, 아스팍톤, 스타라이크에보 줄눈 6종 완벽 비교. 가격, 내구성, 추천 공간까지 한눈에 정리했습니다.',
    keywords: '줄눈종류, 케라폭시줄눈, 폴리우레아줄눈, 아덱스줄눈, 빅라이언줄눈, 아스팍톤줄눈, 스타라이크에보줄눈',
    h1: '줄눈 종류 완벽 비교 가이드 (2025년 최신)',
    subtitle: '6가지 줄눈 종류의 특징, 가격, 장단점을 한눈에 비교해드립니다.',
    schemaType: 'Article',
    priority: 2
  },
  bathroom: {
    slug: 'bathroom',
    url: '/bathroom',
    title: '화장실 줄눈시공 완벽 가이드 - 가격, 과정, 후기 (2025) | 하우스Pick',
    description: '화장실 줄눈시공 가격(신축 30만원~/구축 35만원~), 시공 과정, 전후 비교 사진까지. 욕실 줄눈의 모든 것을 정리했습니다. 5년 무상 A/S.',
    keywords: '화장실줄눈, 화장실줄눈시공, 욕실줄눈, 화장실줄눈가격, 구축화장실줄눈, 신축화장실줄눈',
    h1: '화장실 줄눈시공 완벽 가이드 (2025년)',
    subtitle: '화장실 줄눈시공에 대한 모든 궁금증을 해결해드립니다.',
    schemaType: 'HowTo',
    priority: 3
  },
  price: {
    slug: 'price',
    url: '/price',
    title: '줄눈시공 가격 총정리 (2025) - 화장실 거실 현관 | 하우스Pick',
    description: '2025년 줄눈시공 가격표. 화장실 바닥 30만원~, 거실 150만원, 현관 5만원~. 공간별, 자재별 상세 가격 비교. 정찰제라 추가비용 없음.',
    keywords: '줄눈시공가격, 줄눈가격, 줄눈비용, 화장실줄눈가격, 거실줄눈가격, 케라폭시가격',
    h1: '줄눈시공 가격 총정리 (2025년 최신)',
    subtitle: '하우스Pick 정찰제 가격표를 공개합니다. 추가 비용 없습니다.',
    schemaType: 'Product',
    priority: 4
  },
  review: {
    slug: 'review',
    url: '/review',
    title: '줄눈시공 실제 후기 모음 - Before & After 사진 (2025) | 하우스Pick',
    description: '하우스Pick 줄눈시공 실제 고객 후기. Before/After 사진, 평점 4.9점, 시공 만족도 리뷰를 확인하세요. 화장실, 거실, 현관 시공 사례.',
    keywords: '줄눈시공후기, 줄눈업체후기, 줄눈시공전후, 케라폭시후기, 줄눈시공사진',
    h1: '줄눈시공 실제 후기 모음',
    subtitle: '하우스Pick 고객님들의 실제 후기와 Before/After 사진을 확인하세요.',
    schemaType: 'LocalBusiness',
    priority: 5
  },
  'self-diy': {
    slug: 'self-diy',
    url: '/self-diy',
    title: '셀프 줄눈시공 vs 전문업체 - 뭐가 나을까? 솔직 비교 (2025) | 하우스Pick',
    description: '셀프 줄눈시공 가능할까요? 비용, 난이도, 결과물 솔직 비교. 셀프 후기와 실패 사례까지. 언제 직접 하고 언제 업체에 맡겨야 하는지 알려드립니다.',
    keywords: '셀프줄눈시공, 줄눈셀프, 셀프줄눈후기, DIY줄눈, 줄눈시공방법',
    h1: '셀프 줄눈시공 vs 전문업체, 뭐가 나을까?',
    subtitle: '비용, 난이도, 결과물을 솔직하게 비교해드립니다.',
    schemaType: 'Article',
    priority: 6
  },
  find: {
    slug: 'find',
    url: '/find',
    title: '줄눈업체 추천 - 좋은 업체 고르는 법, 사기 안 당하는 법 (2025) | 하우스Pick',
    description: '줄눈업체 어떻게 골라야 하나요? 좋은 업체 체크리스트, 피해야 할 업체 특징, 가격 비교 방법까지. 줄눈시공 업체 선택 완벽 가이드.',
    keywords: '줄눈업체추천, 줄눈전문업체, 줄눈업체고르는법, 줄눈시공업체, 구축줄눈업체, 신축줄눈업체',
    h1: '줄눈업체 선택 가이드 (사기 안 당하는 법)',
    subtitle: '좋은 업체 특징, 피해야 할 업체, 가격 비교 방법을 알려드립니다.',
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
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": service.h1,
    "description": service.description,
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
    "totalTime": "PT4H",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "KRW",
      "value": "300000-1000000"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "현장 확인",
        "text": "타일 상태와 기존 줄눈 상태를 확인합니다.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "기존 줄눈 제거",
        "text": "전용 기계로 기존 백시멘트 또는 오염된 줄눈을 제거합니다.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "청소 및 건조",
        "text": "먼지와 이물질을 제거하고 완전히 건조시킵니다.",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "케라폭시 시공",
        "text": "에폭시 줄눈재를 배합하여 틈새에 채워넣습니다.",
        "position": 4
      },
      {
        "@type": "HowToStep",
        "name": "마무리 및 경화",
        "text": "표면을 정리하고 24시간 경화 시간을 둡니다.",
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
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "하우스Pick",
    "description": "정찰제 줄눈시공 전문업체",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviewsData.slice(0, 3).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "datePublished": review.date,
      "reviewBody": review.text,
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
