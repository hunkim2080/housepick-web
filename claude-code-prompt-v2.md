# Claude Code 작업 지시서 v2: 아파트 단지별 줄눈시공 페이지 자동 생성

## 프로젝트 개요

HousePick(하우스픽) 웹사이트에 **지역 + 아파트 단지명 조합 롱테일 SEO 페이지**를 대량 자동 생성하는 기능을 추가한다.

네이버 검색에서 "강동구 고덕래미안 줄눈시공" 같은 키워드로 사이트 영역이 최상단 노출되는 것이 확인됨. 이 패턴을 활용해 수도권 주요 아파트 단지별 페이지를 자동 생성하여 롱테일 트래픽을 대규모로 확보하는 것이 목표.

---

## 현재 시스템 구조

### 스택
- **서버**: Node.js + Express.js
- **템플릿**: EJS
- **데이터**: JSON 파일 (`/data/` 디렉토리)
- **배포**: Vercel

### 현재 라우트 순서 (server.js 기준, 충돌 방지 핵심)
```
1. /                          # 홈 (94줄)
2. /reservation               # 예약 (105줄)
3. /blog, /blog/:id           # 블로그 (112-162줄)
4. /admin/*                   # 관리자 (165-292줄)
5. /:service/reviews          # 서비스별 후기 (389줄)
6. /:region/:service?         # 지역 페이지 (414줄)
7. /:service                  # 서비스 페이지 (455줄)
8. 404 핸들러                  # (567줄)
```

### 기존 지역 라우트 핵심 (414-452줄)
```javascript
app.get('/:region/:service?', async (req, res, next) => {
  const { region, service } = req.params;
  const regions = ['seoul', 'gyeonggi', 'incheon', 'busan'];
  const services = ['julnoon', 'move-in-cleaning', 'elastic-coat', 'bathroom-remodeling'];
  if (services.includes(region)) return next();
  if (regions.includes(region)) {
    if (service) return res.render('region-service', { ... });
    else return res.render('region', { ... });
  }
  next();
});
```

---

## 구현할 기능

### 0. 엑셀 데이터 파싱 → apartments.json 자동 변환

**전제**: 레포 루트에 `6000개아파트명.xlsx` 파일이 존재한다.

**엑셀 컬럼 구조**:
| 컬럼 | 필드명 | 설명 |
|---|---|---|
| A | 주소 | "서울특별시 강동구 고덕동 123" 형태 |
| B | 단지명_공시가격 | 공시가격 기준 단지명 |
| C | 단지명_건축물대장 | 건축물대장 기준 단지명 |
| D | 단지명_도로명주소 | 도로명 기준 단지명 **(대표 이름으로 사용)** |
| E | 단지종류 | 숫자 코드 |
| F | 동수 | 동 수 |
| G | 세대수 | 세대수 숫자 |
| H | 사용승인일 | "2019-06-07" 형태 날짜 |

**파싱 스크립트 생성**: `scripts/parse-apartments.js`

아래 로직으로 스크립트를 작성하고 실행하여 `/data/apartments.json`을 생성할 것.

```javascript
// scripts/parse-apartments.js
// 실행: node scripts/parse-apartments.js

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 1. 엑셀 읽기
const workbook = XLSX.readFile('6000개아파트명.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

// 2. 주소에서 region / district 추출
function parseAddress(address) {
  // "서울특별시 강동구 고덕동 123" → { region: 'seoul', districtSlug: 'gangdong', districtName: '강동구' }
  // "경기도 수원시 영통구 ..." → { region: 'gyeonggi', districtSlug: 'suwon-yeongtong', districtName: '수원시 영통구' }
  // "인천광역시 연수구 ..." → { region: 'incheon', districtSlug: 'yeonsu', districtName: '연수구' }
  // 대상 지역 외(부산 등)는 null 반환하여 필터링
}

// 3. 아파트 이름 선택 우선순위
// 1순위: 단지명_도로명주소 (컬럼 D) → 비어있으면
// 2순위: 단지명_건축물대장 (컬럼 C) → 비어있으면
// 3순위: 단지명_공시가격 (컬럼 B)

// 4. 단지명 → slug 변환
// 한글을 로마자로 변환하고 공백/특수문자는 하이픈으로 치환
// 예: "고덕래미안힐스테이트" → "godeok-raemian-hilstate"
// 주의: slug는 URL-safe해야 하며 한글/특수문자/공백 금지
// 같은 district 내 slug 중복 시 뒤에 -2, -3 붙여서 처리

// 4. brand 추출 (단지명 키워드 매핑)
const brandMap = {
  '래미안': '삼성물산',
  '힐스테이트': '현대건설',
  '아이파크': 'HDC현대산업개발',
  '푸르지오': '대우건설',
  'e편한세상': 'DL이앤씨',
  '자이': 'GS건설',
  '롯데캐슬': '롯데건설',
  '더샵': '포스코이앤씨',
  '센트레빌': '동부건설',
  '리버파크': '태영건설',
  // 매칭 없으면 '기타'
};

// 5. year 추출
// 사용승인일 "2019-06-07" → 2019 (숫자)
// 값 없으면 null

// 6. 최종 구조로 조립
// {
//   seoul: { gangdong: { name: '강동구', apartments: [...] } },
//   gyeonggi: { ... },
//   incheon: { ... }
// }

// 7. /data/apartments.json으로 저장
// 저장 후 통계 출력:
// - 총 단지 수
// - region별 단지 수
// - slug 중복 처리 건수
// - brand 매핑 실패(기타) 건수
```

**의존성 추가**: `package.json`에 `xlsx` 패키지가 없다면 추가.
```bash
npm install xlsx
```

**스크립트 실행 후 검증**:
- `/data/apartments.json` 생성 확인
- 터미널 통계 출력 확인
- 서울 강동구 데이터 샘플 5개 콘솔 출력으로 확인

---

### 1. 아파트 데이터 구조 (parse 결과물 기준)

파싱 스크립트 실행 결과로 생성되는 `/data/apartments.json` 구조:

```json
{
  "seoul": {
    "gangdong": {
      "name": "강동구",
      "apartments": [
        {
          "slug": "godeok-raemian-hilstate",
          "name": "고덕래미안힐스테이트",
          "households": 4066,
          "year": 2019,
          "brand": "삼성물산"
        }
      ]
    }
  },
  "gyeonggi": { ... },
  "incheon": { ... }
}
```

**`year` 기반 단지 분류 로직** (템플릿에서 사용):
- 2015년 이후 → `신축` (입주 시공 포커싱)
- 2005~2014년 → `준신축`
- 2004년 이하 → `구축` (곰팡이/재시공 포커싱)

---

### 2. 새 라우트 추가 (server.js)

기존 라우트 순서를 **절대 변경하지 말고**, `/:region/:service?` 라우트(414줄) **바로 위**에 삽입.

```javascript
// 아파트 단지 페이지: /:region/:district/:apartment
// 반드시 /:region/:service? 라우트보다 앞에 위치해야 함
app.get('/:region/:district/:apartment', async (req, res, next) => {
  const { region, district, apartment } = req.params;
  const apartments = require('./data/apartments.json');

  if (!apartments[region]) return next();
  const districtData = apartments[region][district];
  if (!districtData) return next();
  const aptData = districtData.apartments.find(a => a.slug === apartment);
  if (!aptData) return next();

  const regionNames = { seoul: '서울', gyeonggi: '경기', incheon: '인천' };
  const regionName = regionNames[region] || region;

  // 준공연도 기반 단지 유형 분류
  const aptType = aptData.year >= 2015 ? 'new' : aptData.year >= 2005 ? 'mid' : 'old';

  // 인근 아파트 (같은 district, 최대 5개, 자기 자신 제외)
  const nearbyApts = districtData.apartments
    .filter(a => a.slug !== apartment)
    .slice(0, 5);

  return res.render('apartment', {
    regionSlug: region,
    regionName,
    districtSlug: district,
    districtName: districtData.name,
    aptName: aptData.name,
    aptSlug: aptData.slug,
    households: aptData.households,
    year: aptData.year,
    brand: aptData.brand,
    aptType,          // 'new' | 'mid' | 'old'
    nearbyApts,       // 인근 아파트 배열
    districtAllApts: districtData.apartments, // 지역 내 전체 아파트
    title: `${aptData.name} 줄눈시공 전문 | 하우스픽`,
    description: `${districtData.name} ${aptData.name} 케라폭시 줄눈시공 전문업체. 하우스픽이 깔끔하게 시공해드립니다. 무료견적 문의 가능.`,
    canonicalUrl: `https://housepick-web.vercel.app/${region}/${district}/${apartment}`
  });
});
```

**추가**: 기존 `/:region/:service?` 라우트에서 `region-service.ejs` 렌더링 시, 해당 district의 아파트 리스트(최대 20개)도 함께 넘겨줄 것:

```javascript
// 기존 region-service 렌더 부분 수정
const aptData = apartments[region] || {};
const districtApts = Object.entries(aptData).flatMap(([dSlug, d]) =>
  d.apartments.slice(0, 3).map(a => ({
    ...a, districtSlug: dSlug, districtName: d.name
  }))
).slice(0, 20);

return res.render('region-service', {
  ..., // 기존 데이터 유지
  districtApts  // 추가
});
```

---

### 3. EJS 템플릿 생성
**파일 경로**: `/views/apartment.ejs`

기존 `layout.ejs` + `partials/header.ejs` + `partials/footer.ejs` 구조 그대로 상속.

#### 3-1. HEAD SEO 태그
**title 태그 (aptType별 변형)**:
- 신축 (2015~): `[aptName] 입주청소·줄눈시공 전문 | 하우스픽`
- 준신축 (2005~2014): `[aptName] 줄눈시공 전문업체 | 하우스픽`
- 구축 (~2004): `[aptName] 줄눈 곰팡이 제거·재시공 | 하우스픽`

**메타 디스크립션**:
```
[districtName] [aptName] 줄눈시공 전문 하우스픽. 현장 출장 무료견적, 당일 시공 가능. 케라폭시 줄눈시공 개선 사례 다수 보유. 시공 후 AS 보장.
```

#### 3-2. JSON-LD 구조화 데이터 (3종 세트)

**① Service 스키마**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "[aptName] 케라폭시 줄눈시공",
  "provider": {
    "@type": "LocalBusiness",
    "name": "하우스픽",
    "telephone": "010-XXXX-XXXX",
    "areaServed": "[districtName]"
  },
  "serviceType": "줄눈시공",
  "areaServed": "[districtName] [aptName]"
}
```

**② FAQPage 스키마** — 질문에 반드시 아파트명 포함
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[aptName] 줄눈시공 비용은 얼마인가요?",
      "acceptedAnswer": { ... }
    },
    {
      "@type": "Question",
      "name": "[aptName] 시공 기간은 얼마나 걸리나요?",
      "acceptedAnswer": { ... }
    },
    {
      "@type": "Question",
      "name": "[aptName] 입주 전후 언제 시공하는 게 좋나요?",
      "acceptedAnswer": { ... }
    }
  ]
}
```

**③ BreadcrumbList 스키마**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈", "item": "/" },
    { "@type": "ListItem", "position": 2, "name": "[regionName]", "item": "/[regionSlug]" },
    { "@type": "ListItem", "position": 3, "name": "[districtName]", "item": "/[regionSlug]/julnoon" },
    { "@type": "ListItem", "position": 4, "name": "[aptName] 줄눈시공" }
  ]
}
```

#### 3-3. 본문 콘텐츠 구조

**타겟 검색 키워드 (페이지 내 자연스럽게 분산 배치)**

사용자가 실제로 검색하는 패턴을 페이지 전체에서 커버해야 함:
- `[aptName] 줄눈` → title, H1에 포함
- `[aptName] 줄눈시공` → title, H1, 본문에 포함
- `[districtName] [aptName] 줄눈` → 브레드크럼, 메타 디스크립션에 포함
- `[aptName] 줄눈시공업체` → H2 또는 본문 자연 삽입
- `[aptName] 줄눈시공 전문업체` → H2 또는 CTA 섹션에 삽입
- `[aptName] 줄눈시공 개선 사례` → 시공 과정 H2 제목에 활용

**키워드별 배치 위치**:
| 키워드 패턴 | 배치 위치 |
|---|---|
| [aptName] 줄눈시공 | `<title>`, H1 |
| [districtName] [aptName] 줄눈 | 메타 디스크립션, 브레드크럼 |
| [aptName] 줄눈시공업체 | H2 "왜 하우스픽인가?" 소제목 |
| [aptName] 줄눈시공 전문업체 | CTA 섹션 본문 |
| [aptName] 줄눈시공 개선 사례 | 시공 과정 H2 제목 |

---

**브레드크럼 (시각적, 상단 배치)**
```
홈 > 서울 > 강동구 > 고덕래미안힐스테이트 줄눈시공
```

**H1**: `[aptName] 케라폭시 줄눈시공`

**H2: 왜 하우스픽인가?**
- `aptType` 기반 동적 문구 (3가지 패턴 분기):
  - `new` (신축): "입주 전 줄눈시공이 필수인 이유 — [aptName]처럼 새 아파트일수록 빠른 코팅으로 오염을 원천 차단합니다."
  - `mid` (준신축): "[aptName] 준공 [year]년, 지금이 줄눈 재시공 적기입니다. 10년 전 줄눈은 이미 곰팡이 온상이 되어 있을 수 있습니다."
  - `old` (구축): "[brand] 특유의 고밀도 타일 사이에 낀 [year]년부터의 묵은 곰팡이를 케라폭시로 완전 제거합니다."
- `brand` 기반 추가 문구 분기 (삼성물산/현대건설/GS건설 등 최소 3개 패턴)

**H2: 시공 과정** (단계별 설명)

**H2: FAQ** — 질문마다 `[aptName]` 자연 삽입

**H2: 무료 견적 문의**
- 카카오톡 상담 버튼
- 전화 문의 버튼
- `/reservation` 링크

**이미지 SEO**:
- 본문 모든 `<img>` alt 태그: `<%= aptName %> 줄눈시공 하우스픽`
- OG Image가 없을 경우 기본 이미지 사용하되, alt/title은 반드시 동적 삽입

#### 3-4. 인근 아파트 크로스 링킹 (페이지 하단)

**같은 district 내 인근 아파트 5개 링크**:
```html
<section>
  <h3><%= districtName %> 다른 아파트 줄눈시공 사례</h3>
  <ul>
    <% nearbyApts.forEach(apt => { %>
      <li>
        <a href="/<%= regionSlug %>/<%= districtSlug %>/<%= apt.slug %>">
          <%= apt.name %> 줄눈시공
        </a>
      </li>
    <% }) %>
  </ul>
</section>
```

---

### 4. 기존 region-service.ejs 수정

**파일 경로**: `/views/region-service.ejs`

파일 하단에 아래 섹션 추가 (기존 내용 유지):

```html
<section class="region-apartments">
  <h2><%= regionName %> 주요 아파트 줄눈시공</h2>
  <ul>
    <% districtApts.forEach(apt => { %>
      <li>
        <a href="/<%= regionSlug %>/<%= apt.districtSlug %>/<%= apt.slug %>">
          <%= apt.districtName %> <%= apt.name %> 줄눈시공
        </a>
      </li>
    <% }) %>
  </ul>
</section>
```

이렇게 하면 기존 지역 서비스 페이지 → 아파트 페이지로 봇이 자연스럽게 크롤링 경로를 따라가게 됨.

---

### 5. sitemap.xml 엔드포인트

기존 sitemap 라우트가 있다면 통합, 없다면 신규 추가.

```javascript
app.get('/sitemap.xml', async (req, res) => {
  const apartments = require('./data/apartments.json');
  const baseUrl = 'https://housepick-web.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    // 기존 주요 페이지 (priority 높게)
    { loc: `${baseUrl}/`,          priority: '1.0', changefreq: 'weekly'  },
    { loc: `${baseUrl}/julnoon`,   priority: '0.9', changefreq: 'monthly' },
    { loc: `${baseUrl}/seoul`,     priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/gyeonggi`,  priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/incheon`,   priority: '0.8', changefreq: 'monthly' },
    // ... 기존 서비스/지역 페이지들
  ];

  // 아파트 페이지 자동 추가 (priority 0.6)
  for (const [regionSlug, districts] of Object.entries(apartments)) {
    for (const [districtSlug, districtData] of Object.entries(districts)) {
      for (const apt of districtData.apartments) {
        urls.push({
          loc: `${baseUrl}/${regionSlug}/${districtSlug}/${apt.slug}`,
          priority: '0.6',
          changefreq: 'monthly',
          lastmod: today
        });
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});
```

---

### 6. robots.txt 확인 및 수정

`/public/robots.txt` 파일이 아래 내용을 포함하도록 확인/수정:

```
User-agent: *
Disallow: /admin/
Disallow: /admin
Allow: /

Sitemap: https://housepick-web.vercel.app/sitemap.xml
```

---

---

## 단계적 자동 배포 시스템 (Vercel Cron Job)

### 설계 철학
한 번에 6000개를 노출하면 스팸 신호. 꾸준히 성장하는 사이트처럼 보여야 네이버/구글 신뢰도가 올라감. **배포는 한 번, 노출은 자동으로 단계적으로 확장.**

### Phase 배정 기준
파싱 스크립트(`parse-apartments.js`)에서 apartments.json 생성 시 각 단지에 phase 자동 배정:

| Phase | 지역 | 규모 | 노출 시작 |
|---|---|---|---|
| 1 | 서울 강남/서초/송파/강동/마포/용산 | ~800개 | 즉시 |
| 2 | 서울 나머지 구 | ~800개 | 3주 후 |
| 3 | 경기 주요 시 (수원/성남/용인/고양/부천) | ~1500개 | 6주 후 |
| 4 | 경기 나머지 + 인천 전체 | 나머지 | 9주 후 |

```javascript
// parse-apartments.js 내 phase 배정 로직
function assignPhase(region, districtName) {
  const phase1Districts = ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구'];
  const phase3Cities = ['수원시', '성남시', '용인시', '고양시', '부천시'];
  
  if (region === 'seoul' && phase1Districts.some(d => districtName.includes(d))) return 1;
  if (region === 'seoul') return 2;
  if (region === 'gyeonggi' && phase3Cities.some(c => districtName.includes(c))) return 3;
  return 4;
}
```

---

### settings.json 구조 추가
`/data/settings.json`에 현재 활성 phase 상태 저장:

```json
{
  "currentPhase": 1,
  "phaseStartDate": "2026-03-12",
  "phaseSchedule": {
    "1": "2026-03-12",
    "2": "2026-04-02",
    "3": "2026-04-23",
    "4": "2026-05-14"
  }
}
```

---

### Vercel Cron Job 설정
**파일 생성**: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/advance-phase",
      "schedule": "0 9 * * 1"
    }
  ]
}
```
매주 월요일 오전 9시 실행. 3주마다 phase 자동 증가.

**API 라우트 생성**: `/api/advance-phase.js`

```javascript
// GET /api/advance-phase (Vercel Cron이 자동 호출)
module.exports = async (req, res) => {
  // Cron 요청 검증 (보안)
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const settings = require('../data/settings.json');
  const now = new Date();
  const startDate = new Date(settings.phaseStartDate);
  const weeksPassed = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000));
  
  // 3주마다 phase 증가 (최대 4)
  const targetPhase = Math.min(Math.floor(weeksPassed / 3) + 1, 4);
  
  if (targetPhase > settings.currentPhase) {
    settings.currentPhase = targetPhase;
    const fs = require('fs');
    fs.writeFileSync('./data/settings.json', JSON.stringify(settings, null, 2));
    console.log(`Phase advanced to ${targetPhase}`);
  }
  
  res.json({ currentPhase: settings.currentPhase });
};
```

**환경변수 설정 안내**: Vercel 대시보드 → Settings → Environment Variables에 `CRON_SECRET` 추가 (임의의 긴 문자열).

---

### sitemap.xml — 현재 phase까지만 노출

```javascript
app.get('/sitemap.xml', async (req, res) => {
  const apartments = require('./data/apartments.json');
  const settings = require('./data/settings.json');
  const currentPhase = settings.currentPhase;
  const baseUrl = 'https://housepick-web.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: `${baseUrl}/`,         priority: '1.0', changefreq: 'weekly'  },
    { loc: `${baseUrl}/julnoon`,  priority: '0.9', changefreq: 'monthly' },
    { loc: `${baseUrl}/seoul`,    priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/gyeonggi`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/incheon`,  priority: '0.8', changefreq: 'monthly' },
  ];

  // 현재 phase 이하인 단지만 sitemap에 포함
  for (const [regionSlug, districts] of Object.entries(apartments)) {
    for (const [districtSlug, districtData] of Object.entries(districts)) {
      for (const apt of districtData.apartments) {
        if (apt.phase <= currentPhase) {  // 핵심: phase 필터
          urls.push({
            loc: `${baseUrl}/${regionSlug}/${districtSlug}/${apt.slug}`,
            priority: '0.6',
            changefreq: 'monthly',
            lastmod: today
          });
        }
      }
    }
  }

  // XML 생성 및 응답 (기존 동일)
});
```

**참고**: 라우트(`/:region/:district/:apartment`)는 phase 관계없이 **전체 6000개 전부 동작**. 직접 URL 입력하면 항상 접근 가능. sitemap에만 단계적으로 노출.

---

## 작업 순서 (반드시 이 순서대로)

0. **엑셀 파싱 스크립트 실행**
   - `npm install xlsx` (없다면)
   - `scripts/parse-apartments.js` 작성 및 실행 (phase 배정 로직 포함)
   - `/data/apartments.json` 생성 확인 + 통계 출력 확인
   - 샘플 데이터 5개 육안 검증 후 다음 단계 진행

1. `server.js`에 아파트 라우트 추가 (기존 라우트 순서 유지 필수, `/:region/:service?` 바로 위)
2. 기존 `/:region/:service?` 라우트에 `districtApts` 데이터 주입 코드 추가
3. `/views/apartment.ejs` 템플릿 생성 (aptType/brand 기반 동적 문구, 크로스 링킹 포함)
4. `/views/region-service.ejs` 하단에 아파트 링크 섹션 추가
5. `sitemap.xml` 엔드포인트 추가/수정 (phase 필터 + `lastmod`, `priority` 포함)
6. `/data/settings.json`에 currentPhase 초기값(1) 및 phaseSchedule 설정
7. `/api/advance-phase.js` Cron API 생성
8. `vercel.json` Cron Job 스케줄 설정
9. `robots.txt` 확인 및 수정
10. 로컬 테스트:
    - `/seoul/gangdong/godeok-raemian-hilstate` → 정상 렌더링
    - `/seoul/julnoon` → 정상 동작 + 하단 아파트 리스트 노출
    - `/sitemap.xml` → phase 1 단지만 포함 확인
    - phase 2 단지 URL 직접 접근 → 페이지는 정상 열림 (라우트는 전체 동작)
    - 기존 `/julnoon`, `/seoul` → 정상 동작 확인

---

## 주의사항

- **기존 라우트 순서 절대 변경 금지** — 충돌 나면 전체 사이트 망가짐
- 아파트 데이터의 **slug는 URL-safe**해야 함 (한글, 특수문자, 공백 금지)
- 템플릿은 기존 `layout.ejs` 상속 구조 유지 (`<%- include('partials/header') %>` 등)
- **중복 콘텐츠 방지**: `aptType` + `brand` 조합으로 본문 문구가 최소 6가지 이상 변형되어야 함. 아파트 이름만 바뀌고 나머지가 완전히 동일한 페이지가 되어선 안 됨
- 텍스트는 **자연스러운 한국어**로 작성 (SEO 어뷰징처럼 보이지 않게)
- 각 페이지 본문에 단지명이 **최소 5회 이상** 자연스럽게 포함

---

## 성공 기준

| 테스트 항목 | 기대 결과 |
|---|---|
| `/seoul/gangdong/godeok-raemian-hilstate` | 정상 렌더링, 신축 문구 출력 |
| phase 4 단지 URL 직접 접근 | 페이지 정상 열림 (라우트는 전체 동작) |
| `/seoul/julnoon` (기존 페이지) | 정상 동작 + 하단 아파트 리스트 노출 |
| `/julnoon` (서비스 페이지) | 기존과 동일하게 정상 동작 |
| `/sitemap.xml` (currentPhase=1) | phase 1 단지만 포함, `<lastmod>` 있음 |
| `/api/advance-phase` 호출 | settings.json currentPhase 증가 확인 |
| `/robots.txt` | `/admin` disallow, sitemap 경로 명시 |
| 서버 시작 | 에러 없음 |
| 같은 district 내 신축/구축 두 페이지 비교 | 본문 문구가 서로 다름 (중복 콘텐츠 방지) |
