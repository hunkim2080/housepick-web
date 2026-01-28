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
 */
export function generateDynamicTitle(region) {
  const seed = region.slug;
  const selectedKeyword = selectItems(seed + '-title', groutServiceKeywords, 1)[0];
  const selectedSpace = selectItems(seed + '-title-space', groutSpaces, 1)[0];

  // subAreas가 있으면 포함
  const subAreasText = region.subAreas && region.subAreas.length > 0
    ? `(${region.subAreas.slice(0, 2).join(', ')})`
    : '';

  return `${region.name}${subAreasText} ${selectedKeyword} | ${selectedSpace} - 하우스Pick`;
}

/**
 * 동적 SEO Description 생성
 */
export function generateDynamicDescription(region) {
  const seed = region.slug;
  const selectedKeywords = selectItems(seed + '-desc', groutServiceKeywords, 2);
  const selectedSpace = selectItems(seed + '-desc-space', groutSpaces, 1)[0];

  const subAreasText = region.subAreas && region.subAreas.length > 0
    ? ` ${region.subAreas.slice(0, 3).join(', ')} 등`
    : '';

  return `${region.fullName}${subAreasText} ${selectedKeywords[0]}, ${selectedKeywords[1]} 전문. ${selectedSpace} 업계 최초 정찰제, 5년 무상보장. 케라폭시 프리미엄 줄눈재 사용.`;
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
