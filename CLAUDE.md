# 하우스픽 홈페이지 (HousePick)

---

## 작업 방식

나는 세부 구현을 일일이 지시하고 싶지 않다.
나는 "무엇을 원하는지"만 말할 테니, 너는 시니어 풀스택 개발자처럼 스스로 판단해서 완성해라.

### 기본 원칙

1. **완성도 우선**: 기능 하나를 요청하면, 그 기능이 제대로 동작하기 위해 필요한 모든 것을 함께 구현하라
   - 에러 핸들링, 엣지 케이스 처리, 로딩/실패 상태 UI, 유효성 검증

2. **선제적 버그 검증**: 코드 작성 후 스스로 검토하라
   - 발견한 문제는 물어보지 말고 바로 수정
   - 수정한 내용은 마지막에 요약해서 알려줘

3. **UI는 완성형으로**: "일단 동작하는 수준"이 아니라 "바로 쓸 수 있는 수준"으로

4. **맥락 파악**: A를 요청하면 A가 제대로 작동하려면 B, C도 필요한지 판단해서 함께 구현

### 금지 사항
- 뻔한 것 물어보지 마라 ("이렇게 할까요?" 대신 그냥 해라)
- 부분만 구현하고 "나머지는 이렇게 하면 됩니다" 하지 마라
- 플레이스홀더나 TODO 남기지 마라

### 보고 방식
작업 완료 후:
1. 무엇을 구현했는지 (요청한 것)
2. 추가로 무엇을 구현했는지 (내가 판단해서 추가한 것)
3. 테스트 결과
4. 알아둬야 할 사항

---

## 절대 주의사항

### 프로젝트 구조
- 이 프로젝트는 **Vite + React (SPA)** 기반이다 (Next.js 아님, Express.js 아님)
- 운영 레포 경로: `C:\Users\admin\Desktop\housepick-web`
- 절대 혼동 금지: `C:\naver-checker\website`는 별도 사본 (여기서 작업하지 마라)

### Git 규칙
- **main 브랜치에 직접 force push 절대 금지**
- push 전에 반드시 현재 경로 확인: `pwd`

### 원래 사이트 확인 기준
- 헤드라인: "줄눈 가격, 이제 검색하지 마세요"
- 전화번호: 010-6461-0131
- 도메인: housepick-web.vercel.app

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | React 18 + Vite 5 (SPA + SSG) |
| 스타일 | Tailwind CSS 3.4 |
| 배포 | Vercel Pro |
| 데이터 | JSON 파일 기반 |
| 이미지 처리 | sharp |

### 빌드 파이프라인 (package.json build 스크립트)
```
1. vite build
2. generate-regional-pages.js      → 지역 페이지 67개 + sitemap.xml 최초 생성
3. generate-service-pages.js       → 서비스 페이지 7개
4. generate-apartment-pages.js     → 아파트 페이지 4,418개 + sitemap 추가
5. generate-district-hub-pages.js  → 구 허브 페이지 78개 + sitemap 추가
6. analyze-stats.js                → data/stats-summary.json 생성
7. generate-stats-page.js          → 통계 리포트 페이지 + sitemap 추가
8. generate-kerapoxy-guide.js      → 케라폭시 가이드 페이지 + sitemap 추가
9. check-similarity.js             → 유사도 검사 (0.96 초과 시 배포 차단)
```

**주의:** vercel.json의 buildCommand는 반드시 `npm run build`만 사용.

### 파일 구조
```
housepick-web/
├── src/
│   ├── App.jsx
│   ├── components/         # BeforeAfter, Breadcrumb, Footer, Header 등
│   ├── data/               # regions.js, services.js, keywords.js, navigation.js
│   ├── utils/
│   │   └── contentGenerator.js  # 시드 기반 동적 SEO 콘텐츠 생성
│   └── pages/              # RegionalPage, ServicePage, PrivacyPolicy, NotFound
├── scripts/
│   ├── generate-regional-pages.js
│   ├── generate-service-pages.js
│   ├── generate-apartment-pages.js
│   ├── generate-district-hub-pages.js
│   ├── generate-stats-page.js
│   ├── generate-kerapoxy-guide.js
│   ├── analyze-stats.js
│   ├── check-similarity.js
│   ├── schema-generators.js        # 리치 스니펫 JSON-LD 유틸리티
│   ├── add-upcoming-apartments.js
│   └── regenerate-slugs.js
├── templates/
│   ├── regional.html
│   ├── apartment.html
│   ├── district-hub.html
│   ├── service.html
│   ├── kerapoxy-guide.html
│   ├── stats.html
│   ├── privacy.html
│   └── 404.html
├── data/
│   ├── apartments.json         # 4,418개 단지 데이터
│   ├── settings.json           # Phase 설정 (currentPhase, phaseSchedule)
│   ├── stats-summary.json      # 통계 데이터 (빌드 시 자동 생성)
│   ├── district-stats.json     # 구 단위 통계 (빌드 시 자동 생성)
│   ├── reservations.json       # 예약 데이터 (Demand API용)
│   ├── posts.json
│   └── reviews.json
├── api/
│   ├── advance-phase.js        # Vercel Cron (Phase 자동 증가)
│   └── district-demand.js      # 구별 상담 수요 API
├── public/images/
│   ├── og/                     # OG 이미지 (지역별)
│   └── projects/               # 시공 사례 이미지 (지역별 before/after)
├── vercel.json
└── package.json
```

---

## 사이트 구조

### URL 계층 (Hub & Spoke)
```
[Tier 1] /                                            # 메인 + 서비스 페이지 7개
[Tier 2] /gangnam                                      # 시/구 허브 (67개)
[Tier 3] /seoul/gangdong/julnoon                       # 구 허브 (78개)
[Tier 4] /seoul/gangdong/godeok-raemian-hilstate       # 아파트 (4,418개)
[특수]   /kerapoxy-guide                               # 케라폭시 가이드
[특수]   /stats/metropolitan-grout-index               # 통계 리포트
```

### 현재 Sitemap 구성 (약 686개 URL)
- 메인 + 서비스 + 지역 페이지: ~76개
- 아파트 페이지 (Phase 1 + 입주예정 3개월 이내): ~531개
- 구 허브 페이지: 78개
- 케라폭시 가이드 + 통계 페이지: 2개

---

## 핵심 가치

- **정찰제 가격**: 화장실 바닥 30만원, 전체 90만원 — 현장 추가비용 없음
- **5년 무상 A/S**: 탈락/들뜸/변색 시 무상 재시공
- **이탈리아 마페이 정품 케라폭시** 사용
- **전문 교육 기반 시공**: 하도급 없음

---

## 콘텐츠 고유성 시스템 (2026-03-19)

아파트별 고유 콘텐츠 생성을 위한 5가지 동적 계산 필드:

| 필드 | 계산 기준 | 값 |
|------|----------|-----|
| heating | 준공년도 | 중앙난방(<2000), 개별난방(구형)(2000-2009), 개별난방(신형)(2010+) |
| tileType | 브랜드 | 포세린(래미안/자이/더샵/아이파크), 세라믹(힐스테이트/푸르지오/롯데캐슬/기타), 강화세라믹(e편한세상) |
| complexType | 세대수 | 대단지(2000+), 중형단지(500-1999), 소형단지(<500) |
| ageMonths | 준공일 | 현재날짜 - 준공일 (월 없으면 6월 기본) |
| agePeriod | ageMonths | 0-36개월→"N개월", 37-84개월→"N년 M개월", 85+개월→"N년" |

**생성 함수:**
- `generateAnalysis(apt)`: 난방+타일+경과기간 조합 + 정확한 수치 삽입 (약 350자)
- `getComplexNote(apt)`: 세대수 기반 단지 특성 + 수치 활용 (약 150자)

**관련 파일:** `scripts/generate-apartment-pages.js` (62-165줄), `templates/apartment.html`

---

## 페이지 유사도 검사 시스템 (2026-03-19)

빌드 시 자동으로 아파트 페이지 간 콘텐츠 유사도를 검사하여 중복 콘텐츠 방지.

| 유사도 | 결과 |
|--------|------|
| >= 0.96 | 배포 차단 |
| >= 0.85 | 경고 |
| < 0.85 | 통과 |

**관련 파일:** `scripts/check-similarity.js`

---

## 구별 상담 수요 API (2026-03-20)

- 엔드포인트: `GET /api/district-demand?district=gangdong`
- `data/reservations.json`에서 최근 7일 해당 구 예약 건수 카운트 (최소값 3 보정)
- CTA 위에 "이번 주 N명이 OO구에서 상담 신청했습니다" 배지 표시

**관련 파일:** `api/district-demand.js`, `templates/apartment.html`

---

## SEO 친화적 아파트 슬러그 (2026-03-23)

브랜드명/영어차용어를 영문으로 변환하여 URL 가독성 개선.

| 한글 | 슬러그 |
|------|--------|
| 힐스테이트 | hillstate |
| 래미안 | raemian |
| 자이 | xi |
| 푸르지오 | prugio |
| 센트럴/파크/리버/타워 등 | central/park/river/tower |

**관련 파일:** `scripts/add-upcoming-apartments.js` (koreanToSlug), `scripts/regenerate-slugs.js`

---

## 데이터 리포트 페이지 (2026-03-23)

**URL:** `/stats/metropolitan-grout-index`

수도권 4,418개 아파트 줄눈 재시공 권장 리포트. 법적 안전장치 적용 ('노후' → '재시공 권장').

**JSON-LD:** Dataset (CC BY-NC-SA 4.0, GeoShape, variableMeasured 등)

**관련 파일:** `scripts/analyze-stats.js`, `scripts/generate-stats-page.js`, `templates/stats.html`

---

## 케라폭시 마스터 가이드 (2026-03-23)

**URL:** `/kerapoxy-guide`

케라폭시 키워드 구글 상위 노출용 전문 콘텐츠 허브.

**구성:** 3종 비교표, 통계 카드, FAQ 4개(아코디언), 예상 수명 계산기, 전문가 칼럼, 시공 지역 내부 링크

**JSON-LD:** Article + FAQPage + HowTo (3단계 공정)

**관련 파일:** `templates/kerapoxy-guide.html`, `scripts/generate-kerapoxy-guide.js`

---

## 리치 스니펫 스키마 시스템 (2026-04-01)

`scripts/schema-generators.js`에 6개 함수로 페이지 유형별 JSON-LD 생성:

| 페이지 유형 | 스키마 |
|-------------|--------|
| 지역 페이지 (67개) | LocalBusiness + BreadcrumbList + ItemList(포트폴리오) + **FAQPage** + **SiteNavigation** |
| 구 허브 (78개) | LocalBusiness + BreadcrumbList + **HubFAQ** + **ImageCarousel(상위 10개 아파트)** |
| 아파트 (4,418개) | Service + FAQPage + BreadcrumbList |
| 케라폭시 가이드 | Article + FAQPage + **HowTo(3단계 공정)** |
| 통계 페이지 | **Dataset(강화 버전, GeoShape, identifier 등)** |

---

## Phase 배포 전략

| Phase | 시작일 | 규모 |
|---|---|---|
| 1 | 2026-03-12 | 462개 (서울 핵심 8개 구) |
| 2 | 2026-04-02 | 758개 |
| 3 | 2026-04-23 | 597개 |
| 4 | 2026-05-14 | 540개 |
| 5 | 2026-06-04 | 831개 |
| 6 | 2026-06-25 | 1,046개 |

페이지는 4,418개 전부 빌드되지만, Sitemap에는 해당 Phase 이하만 포함.
입주예정 아파트는 입주 3개월 전부터 자동 Sitemap 노출.

**관련 파일:** `data/settings.json`, `api/advance-phase.js` (Vercel Cron, 매주 일요일)

---

## 리뷰 수 (2026-04-01)

- 전체 리뷰: **4,200건** (JSON-LD reviewCount, UI 모두 반영)
- 지역별 리뷰: 3,800~4,600 랜덤 (시드 기반, `contentGenerator.js`의 `generateRating`)
- 평점 분포: 5점 3,864건(92%), 4점 252건(6%), 3점 84건(2%)

---

## Supabase (2026-04-02)

| 항목 | 값 |
|------|-----|
| 프로젝트 | housepick-trade |
| URL | https://bnzgtqktvevqxtnceiwv.supabase.co |
| Region | Northeast Asia (Seoul) |
| DB Password | .sCm?W6#U%/P%4e |
| Publishable Key | (Vercel 환경변수 참조) |
| Secret Key | (Vercel 환경변수 SUPABASE_SECRET_KEY 참조) |
| Plan | Free (NANO) |

### 테이블

**apartment_trades** — 국토부 실거래 거래량 데이터
- district_code, district_name, apartment_name, dong_name, trade_count, deal_month, collected_at
- 용도: 빌드 시 거래량 → sitemap priority 반영
- 수집: `api/collect-trade.js` (Vercel Cron 매시간 1구) + `scripts/sync-trade-data.js` (로컬 일괄)

**portfolio** — 시공 사례
- apartment_slug, apartment_name, district_name, region_slug
- space_type, issue_type, material_type, work_date, case_slug
- before_image (JSON 배열), after_image (JSON 배열)
- memo, staff_name, seo_title, seo_content
- detail_content, maintenance_tips, tile_type, customer_request
- status (pending/approved/rejected)
- 용도: 직원 업로드 → 관리자 승인 → 빌드 시 시공 사례 페이지 생성

---

## 거래량 수집 시스템 (2026-04-02)

| 방식 | 파일 | 동작 |
|------|------|------|
| 자동 (Vercel Cron) | `api/collect-trade.js` | 매시간 1구씩, 84개 구 약 9일 순환 |
| 수동 (로컬) | `scripts/sync-trade-data.js` | 84개 구 일괄 수집 (초기 적재용) |

- 조회 대상: 2개월 전 거래 데이터 (국토부 지연 반영)
- 거래량 → sitemap priority: 20건+ → 0.9 / 10건+ → 0.8 / 5건+ → 0.7

**관련 환경변수 (Vercel):** SUPABASE_URL, SUPABASE_SECRET_KEY, MOLIT_API_KEY

---

## 시공 사례 시스템 (2026-04-05)

### 전체 흐름
```
직원 업로드 (/admin/upload, 비번: 2080abc!)
  아파트 선택 + 부위 + 문제유형 + 자재 + 시공일 + 사진 + 메모
    ↓ 자동
  SEO 원고 생성 (아파트 데이터 + 메모 키워드 반영 + 가격)
    ↓
  Supabase portfolio 테이블 저장 (status: pending)

관리자 승인 (/admin/review, 비번: 2080admin!)
    ↓

빌드 시 (generate-case-pages.js)
  1. Supabase에서 approved 조회
  2. 점수제 품질 게이트 (7점/11점 이상만 상세 페이지 생성)
  3. 상세 페이지: /{region}/{district}/{apt}/cases/{case-slug}
  4. case-cards.json 생성 → 아파트 허브 페이지에 카드 삽입
  5. sitemap에 품질 통과 사례만 추가
```

### URL 구조
```
허브 (메인 키워드):  /seoul/gangnam/raemian-firstige
사례 (롱테일):      /seoul/gangnam/raemian-firstige/cases/20260405-bathroom-kerapoxy-a12f
```

### case-slug 규칙
`{YYYYMMDD}-{space}-{material}-{4자리랜덤}` (예: `20260405-bathroom-kerapoxy-a12f`)

### 점수제 품질 게이트 (7점/11점 이상 통과)

| 항목 | 점수 |
|------|------|
| before+after 모두 존재 | 2점 |
| 사진 3장 이상 | 2점 |
| 본문 500자 이상 (300자+ = 1점) | 2점 |
| 문제 유형 존재 | 1점 |
| 자재 정보 존재 | 1점 |
| 시공 부위 존재 | 1점 |
| 현장 메모 존재 | 1점 |
| 시공일 존재 | 1점 |

- 미달 시: 상세 URL 미생성, 허브 카드에서만 링크 없이 노출
- sitemap에도 미포함

### 허브/사례 title 역할 분리

| | 허브 | 사례 |
|---|---|---|
| title | `[아파트] 줄눈시공 | 시공 사례 N건` | `[아파트] [공간] 줄눈시공 사례 | [문제] | [날짜]` |
| H1 | `[아파트] 케라폭시 줄눈시공` | `[아파트] [공간] [자재] – [문제] 개선 사례` |
| canonical | self | self |
| schema | Service + FAQ + Breadcrumb | Article + Breadcrumb |

### 관련 사례 선정 기준
같은 아파트 내에서: 같은 공간(+3) > 같은 문제유형(+2) > 같은 자재(+1) > 최신순

### 이미지 alt
데이터 기반 자동 생성: `[아파트명] [공간] 줄눈시공 전/후 사진`

### SEO 원고 자동 생성
- 아파트 데이터(준공연도, 세대수, 브랜드) + 시공 데이터(부위, 문제, 자재) 조합
- 메모 키워드 감지 (곰팡이/변색/크랙/냄새/습기) → 본문에 자연스럽게 반영
- 부위별 정찰제 가격 안내 포함
- 5단락: 배경 → 시공 과정 → 결과 → 가격 → CTA

### 직원 목록
| 이름 | 역할 |
|------|------|
| 제이쓴 | 시공 |
| 이동환 | 시공 |
| 임태현 | 시공 |

### 관련 파일
| 파일 | 역할 |
|------|------|
| `templates/admin-upload.html` | 직원 업로드 페이지 |
| `templates/admin-review.html` | 관리자 승인 페이지 |
| `templates/case-detail.html` | 사례 상세 템플릿 |
| `scripts/generate-case-pages.js` | 사례 페이지 빌드 + case-cards.json 생성 |

---

## 현장 등록 시스템 v2 (2026-04-05, 설계 완료 / 구현 진행 중)

### 아키텍처

```
직원 벌크 업로드 (20장)
  ↓ 브라우저: EXIF 파싱 + 썸네일 생성 + 원본 업로드
Supabase Storage
  ├── originals/ (비공개, 20MB 제한) ← 원본
  └── public-assets/ (공개, 5MB 제한) ← 승인 후 최적화본 (EXIF 제거)
Supabase DB
  ├── job_cases (현장 단위)
  ├── job_case_images (이미지 단위, 자동값/확정값 분리)
  └── job_case_events (작업 흐름 기록)

직원 UI → 장소/단계 매칭 → status: review_ready
    ↓
관리자 UI → 검수 + 대표 사진 → status: approved → published
    ↓ 공개용 이미지 생성 (EXIF 제거, WebP, 1200px)
    ↓
빌드 시 → published만 조회 → 사례 페이지 생성
```

### DB 테이블

**job_cases** — 현장 단위
- status: draft → review_ready → approved → published → archived / rejected
- case_slug: `{date}-{space}-{material}-{shortId}`
- representative_image_id: 대표 이미지 1장

**job_case_images** — 이미지 단위
- auto_step: EXIF 시간 기반 제안 (before/during/after, 확정 아님)
- confirmed_step: 직원 확정값 (사이트/SEO에 이것만 사용)
- confirmed_location: 직원 확정 장소
- is_excluded: 발행 대상 제외
- is_representative: 대표 이미지 플래그
- storage_path_original (비공개) / storage_path_public (승인 후 생성)

**job_case_events** — 작업 흐름
- event_type: before, during, after, inspection, cleanup, finish

### EXIF 처리 정책
- 촬영 시각: 추출하여 auto_step 제안 (07~11시: before, 11~13:30: during, 13:30+: after)
- GPS/기기명: 내부 저장하지 않음, 공개 이미지에 절대 포함 금지
- EXIF 없거나 비정상: null 처리, unclassified 상태

### 이미지 자산 처리
- 원본: originals/ 버킷 (비공개, 그대로 보관)
- 공개본: public-assets/ 버킷 (WebP, 1200px, EXIF 제거, approved 이후 생성)
- 썸네일: 브라우저에서 400px 생성, originals/thumbnails/에 저장
- 파일명: `{apt-slug}-{location}-{step}-{date}-{shortId}.webp`

### 품질 게이트 (v2)
- before 또는 현장 상태컷 1장 이상
- after 컷 1장 이상
- 발행 후보 이미지 3장 이상 (is_excluded=false)
- 발행 후보 이미지 모두 장소+단계 확정
- 대표 이미지 1장 선택
- 관리자 승인 완료

### 상태값 & 공개 정책
| 상태 | 공개 | sitemap | 사례 페이지 |
|------|------|---------|------------|
| draft | X | X | X |
| review_ready | X | X | X |
| approved | X | X | X |
| **published** | **O** | **O** | **O** |
| archived | X | X | X |
| rejected | X | X | X |

### 구현 진행 상황
- [x] Phase 1: DB 스키마 + Storage 설계 (`supabase/001_job_cases_schema.sql`)
- [ ] Phase 2: 업로드 UI 재작성 (벌크 + 장소/단계 매칭)
- [ ] Phase 3: 관리자 검수 UI + 품질 게이트 + 발행
- [ ] Phase 4: 빌드 연동 + SEO 반영

### 관련 파일
| 파일 | 역할 |
|------|------|
| `supabase/001_job_cases_schema.sql` | DB 스키마 (테이블 + 인덱스 + 버킷 + RLS + 트리거) |
| `templates/admin-upload.html` | 직원 업로드 (v1, Phase 2에서 재작성) |
| `templates/admin-review.html` | 관리자 검수 (v1, Phase 3에서 재작성) |

---

## 남은 작업 (우선순위순)

### 단기
- [ ] 현장 등록 시스템 v2 Phase 2~4 구현
- [ ] 시공 사례 실제 데이터 10건+ 축적
- [ ] Phase 2 배포 전환
- [ ] Google Search Console 색인 모니터링

### 중기 — 보안 강화 (Supabase Auth 도입 후)
- [ ] Supabase Auth 도입 (직원별 이메일/비밀번호 로그인)
- [ ] RLS 활성화:
  - SELECT: published만 공개, 직원은 본인 건만, 관리자는 전체
  - INSERT: auth.uid() = created_by 강제 (WITH CHECK)
  - UPDATE: 직원은 본인 draft/review_ready만, 관리자는 전체
  - DELETE: 금지 (soft delete only)
- [ ] Storage RLS: 비공개 버킷 직원 본인 폴더만 접근
- [ ] 역할 분리: user_metadata.role = 'staff' | 'admin'
- [ ] Edge Function으로 발행/삭제 등 고권한 작업 이동
- [ ] 감사 로그 테이블 (who/what/when)
- [ ] sitemap 검증 스크립트
- [ ] 증분 빌드

### 현재 적용된 보안 조치
- [x] 파일 검증: MIME 타입 (jpeg/png/webp/heic만), 단일 15MB, 총 100MB 제한
- [x] Soft delete: 하드 삭제 대신 archived 처리 (복구 가능)
- [x] 공개 데이터 분리: 빌드 시 published만 조회 (generate-case-pages.js)
- [x] 직원별 개별 비밀번호 (클라이언트 레벨)
- [x] admin 페이지 noindex/nofollow
- [ ] RLS 미적용 (Auth 도입 전까지 불가)
- [ ] Storage RLS 미적용

### 장기
- [ ] AI Vision API 연동 (장소/단계 자동 감지)
- [ ] AI SEO 원고 품질 강화
- [ ] 직원별 시공 사례 통계
- [ ] 거래량 기반 Phase 자동 배분
- [ ] Rate limiting (Redis 기반)

---

## 빌드 파이프라인 (package.json build)

```
1. vite build
2. generate-regional-pages.js     → 지역 67개 + sitemap + robots + rss + admin 페이지
3. generate-service-pages.js      → 서비스 7개
4. generate-case-pages.js         → Supabase approved 사례 → 상세 페이지 + case-cards.json
5. generate-apartment-pages.js    → 아파트 4,418개 (사례 카드 삽입 + 거래량 priority)
6. generate-district-hub-pages.js → 구 허브 78개
7. analyze-stats.js               → stats-summary.json
8. generate-stats-page.js         → 통계 리포트
9. generate-kerapoxy-guide.js     → 케라폭시 가이드
10. check-similarity.js           → 유사도 검사 (0.96 차단)
```

---

## 개발 환경

```bash
cd C:\Users\admin\Desktop\housepick-web
npm install
npm run dev     # Vite 개발 모드
npm run build   # 프로덕션 빌드
```
