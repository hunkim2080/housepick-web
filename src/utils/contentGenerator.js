/**
 * HousePick SEO 콘텐츠 엔진 - 동적 콘텐츠 생성기
 * 52개 지역 페이지마다 고유한 SEO 콘텐츠를 자동 생성합니다.
 */

import {
  groutServiceKeywords,
  groutSpaces,
  coreMaterials,
  materialDescriptions,
  introTemplates,
  problemTemplates,
  solutionTemplates,
  spaceTemplates,
  conclusionTemplates
} from '../data/keywords.js';

/**
 * 시드 기반 결정론적 랜덤 생성기
 * 동일한 지역 slug는 항상 동일한 콘텐츠를 생성합니다.
 */
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }

  return function() {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

/**
 * Fisher-Yates 셔플 알고리즘으로 배열에서 랜덤 선택
 */
function selectItems(seed, array, count) {
  const rng = seededRandom(seed);
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

/**
 * 지역 데이터 기반으로 SEO 콘텐츠 생성
 */
export function generateSEOContent(region) {
  const seed = region.slug;
  const rng = seededRandom(seed + '-main');

  // 키워드 선택 (시드 기반 결정론적)
  const selectedServiceKeywords = selectItems(seed + '-service', groutServiceKeywords, 3);
  const selectedSpaces = selectItems(seed + '-space', groutSpaces, 3);
  const selectedMaterials = selectItems(seed + '-material', coreMaterials, 2);

  // 템플릿 선택
  const introIdx = Math.floor(seededRandom(seed + '-intro')() * introTemplates.length);
  const problemIdx = Math.floor(seededRandom(seed + '-problem')() * problemTemplates.length);
  const solutionIdx = Math.floor(seededRandom(seed + '-solution')() * solutionTemplates.length);
  const spaceIdx = Math.floor(seededRandom(seed + '-spaceT')() * spaceTemplates.length);
  const conclusionIdx = Math.floor(seededRandom(seed + '-conclusion')() * conclusionTemplates.length);

  // 세부 지역 (subAreas)에서 하나 선택
  const subArea = region.subAreas && region.subAreas.length > 0
    ? region.subAreas[Math.floor(seededRandom(seed + '-subarea')() * region.subAreas.length)]
    : '';

  // 템플릿 변수 치환
  const replacements = {
    '{name}': region.name,
    '{fullName}': region.fullName,
    '{subArea}': subArea,
    '{keyword1}': selectedServiceKeywords[0],
    '{keyword2}': selectedServiceKeywords[1],
    '{keyword3}': selectedServiceKeywords[2],
    '{space1}': selectedSpaces[0],
    '{space2}': selectedSpaces[1],
    '{space3}': selectedSpaces[2],
    '{material1}': selectedMaterials[0],
    '{material2}': selectedMaterials[1],
    '{materialDesc}': materialDescriptions[selectedMaterials[0]] || ''
  };

  function applyReplacements(template) {
    let result = template;
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    return result;
  }

  // 각 섹션 콘텐츠 생성
  const intro = applyReplacements(introTemplates[introIdx]);
  const problem = applyReplacements(problemTemplates[problemIdx]);
  const solution = applyReplacements(solutionTemplates[solutionIdx]);
  const space = applyReplacements(spaceTemplates[spaceIdx]);
  const conclusion = applyReplacements(conclusionTemplates[conclusionIdx]);

  // 문단 순서 변형 (본론 1,2,3 순서 랜덤화)
  const bodyParts = [
    { type: 'problem', title: '줄눈 고민 해결', content: problem },
    { type: 'solution', title: '프리미엄 줄눈재 사용', content: solution },
    { type: 'space', title: '시공 가능 공간', content: space }
  ];

  // 시드 기반 셔플
  const orderRng = seededRandom(seed + '-order');
  for (let i = bodyParts.length - 1; i > 0; i--) {
    const j = Math.floor(orderRng() * (i + 1));
    [bodyParts[i], bodyParts[j]] = [bodyParts[j], bodyParts[i]];
  }

  return {
    intro,
    bodyParts,
    conclusion,
    keywords: {
      service: selectedServiceKeywords,
      spaces: selectedSpaces,
      materials: selectedMaterials
    },
    subArea
  };
}

/**
 * 해시태그 클라우드 생성
 */
export function generateHashtags(region) {
  const seed = region.slug;

  const selectedServiceKeywords = selectItems(seed + '-service', groutServiceKeywords, 3);
  const selectedSpaces = selectItems(seed + '-space', groutSpaces, 2);

  const hashtags = [
    `${region.name}줄눈`,
    `${region.name}줄눈시공`,
    `${region.fullName}줄눈`,
    ...selectedServiceKeywords.map(k => k.replace(/ /g, '')),
    ...selectedSpaces.map(s => s.replace(/ /g, '')),
    '케라폭시줄눈',
    '정찰제줄눈',
    '5년무상보장'
  ];

  // subAreas가 있으면 추가
  if (region.subAreas && region.subAreas.length > 0) {
    const selectedSubAreas = selectItems(seed + '-hashtag-sub', region.subAreas, 2);
    hashtags.push(...selectedSubAreas.map(s => `${s}줄눈시공`));
  }

  return [...new Set(hashtags)]; // 중복 제거
}

/**
 * 동적 SEO Title 생성
 * 클릭률 최적화: 케라폭시 키워드 앞에, 브랜드명 뒤로
 */
export function generateDynamicTitle(region) {
  return `${region.fullName} 케라폭시 줄눈시공 | 30만원~ 정찰제`;
}

/**
 * 동적 SEO Description 생성
 * 클릭률 최적화: 케라폭시 키워드 앞에, 숫자 포함, 지역 세부정보 포함
 */
export function generateDynamicDescription(region) {
  // subAreas에서 주요 동/읍/면 추출 (최대 3개)
  const areas = region.subAreas && region.subAreas.length > 0
    ? region.subAreas.slice(0, 3).join(', ')
    : '';

  const areaText = areas ? `${areas} ` : '';

  return `${region.fullName} ${areaText}케라폭시 줄눈시공 전문. 화장실 30만원~. 정찰제 가격, 5년 무상 A/S 보장.`;
}

/**
 * 동적 SEO Keywords 생성 (meta keywords용)
 */
export function generateMetaKeywords(region) {
  const seed = region.slug;
  const selectedServiceKeywords = selectItems(seed + '-meta', groutServiceKeywords, 5);
  const selectedSpaces = selectItems(seed + '-meta-space', groutSpaces, 3);

  const keywords = [
    `${region.name} 줄눈`,
    `${region.name} 줄눈시공`,
    `${region.fullName} 줄눈시공`,
    ...selectedServiceKeywords,
    ...selectedSpaces,
    '케라폭시 줄눈',
    '정찰제 줄눈시공',
    '하우스Pick'
  ];

  // subAreas가 있으면 추가
  if (region.subAreas && region.subAreas.length > 0) {
    keywords.push(...region.subAreas.slice(0, 3).map(s => `${s} 줄눈`));
  }

  return [...new Set(keywords)].join(', ');
}

/**
 * 자동 링크화 (인접 지역/동 이름을 링크로 변환)
 */
export function autoLinkText(text, region, allRegions) {
  let result = text;

  // 인접 지역 링크화
  if (region.nearbyAreas && allRegions) {
    const areaSlugMap = {};
    allRegions.forEach(r => {
      areaSlugMap[r.name] = r.slug;
      areaSlugMap[r.fullName] = r.slug;
    });

    region.nearbyAreas.forEach(area => {
      const areaName = area.replace('서울 ', '');
      const slug = areaSlugMap[areaName];
      if (slug && slug !== region.slug) {
        const regex = new RegExp(`(?<![가-힣])${areaName}(?![가-힣])`, 'g');
        result = result.replace(regex, `<a href="/${slug}" class="text-amber-600 hover:underline">${areaName}</a>`);
      }
    });
  }

  return result;
}

/**
 * 이미지 alt 태그 자동 생성
 * 규칙: [지역명] [세부지역] [자재] 줄눈시공 [공간] 시공 전/후 사진 - 하우스Pick
 *
 * @param {Object} region - 지역 데이터 (slug, name, subAreas 등)
 * @param {Object} project - 프로젝트 데이터 (id, location, scope 등)
 * @param {string} type - 'before' 또는 'after'
 * @returns {string} SEO 최적화된 alt 텍스트
 */
export function generateImageAlt(region, project, type = 'after') {
  const seed = `${region.slug}-${project.id}`;

  // 시드 기반 키워드 선택 (동일 프로젝트는 항상 동일한 결과)
  const selectedMaterial = selectItems(seed + '-alt-mat', coreMaterials, 1)[0];
  const selectedSpace = selectItems(seed + '-alt-space', groutSpaces, 1)[0];

  // 세부 지역: project.location에서 첫 번째 단어 또는 subAreas 첫 번째
  const subArea = project.location?.split(' ')[0]
    || (region.subAreas && region.subAreas.length > 0 ? region.subAreas[0] : '');

  // 시공 전/후 텍스트
  const typeText = type === 'before' ? '시공 전' : '시공 후';

  // alt 텍스트 조합
  return `${region.name} ${subArea} ${selectedMaterial} 줄눈시공 ${selectedSpace} ${typeText} 사진 - 하우스Pick`.trim().replace(/\s+/g, ' ');
}

/**
 * 폴백 이미지용 alt 텍스트 생성
 * @param {Object} region - 지역 데이터
 * @returns {string} 폴백 alt 텍스트
 */
export function generateFallbackAlt(region) {
  return `${region.name} 줄눈시공 준비 중 - 하우스Pick`;
}

/**
 * 지역별 동적 평점/리뷰 수 생성 (4.7~5.0, 80~150 리뷰)
 * 시드 기반으로 동일 지역은 항상 동일한 값 반환
 * @param {Object} region - 지역 데이터
 * @returns {{ ratingValue: string, reviewCount: number }}
 */
export function generateRating(region) {
  const rng = seededRandom(region.slug + '-rating');
  return {
    ratingValue: (4.7 + rng() * 0.3).toFixed(1),
    reviewCount: Math.floor(80 + rng() * 70)
  };
}

/**
 * 시드 기반 프로젝트 데이터 자동 생성 (projects 없는 지역용)
 * 지역의 apartments, landmarks 데이터를 활용하여 3개 프로젝트 생성
 * @param {Object} region - 지역 데이터
 * @returns {Array} 프로젝트 배열
 */
export function generateProjectData(region) {
  const apartments = region.apartments || [];
  const spaces = ['화장실', '현관', '거실'];
  const scopes = ['화장실 2개소', '현관 + 복도', '거실 전체'];
  const descriptions = [
    '오래된 아파트 줄눈 전면 교체. 곰팡이 제거 및 케라폭시 줄눈재로 깔끔한 마감.',
    '현관 타일 줄눈 리뉴얼. 밝은 색상으로 고급스러운 첫인상 완성.',
    '거실 바닥 줄눈 시공. 넓은 공간 균일하게 마감하여 깔끔한 분위기.'
  ];

  return [1, 2, 3].map(n => {
    const rng = seededRandom(region.slug + `-project-${n}`);
    const aptIdx = Math.floor(rng() * Math.max(apartments.length, 1));
    const apartment = apartments[aptIdx] || `${region.name} 아파트`;
    const spaceIdx = (n - 1) % spaces.length;
    const space = spaces[spaceIdx];

    // 날짜 생성 (2024-01 ~ 2024-12)
    const month = String(Math.floor(rng() * 12) + 1).padStart(2, '0');

    return {
      id: `${region.slug}-00${n}`,
      title: `${region.fullName} ${apartment} ${space} 줄눈시공`,
      date: `2024-${month}`,
      location: apartment,
      scope: scopes[spaceIdx],
      images: {
        before: `/images/projects/${region.slug}/${region.slug}-00${n}-before.webp`,
        after: `/images/projects/${region.slug}/${region.slug}-00${n}-after.webp`
      },
      description: descriptions[spaceIdx]
    };
  });
}
