# 하우스픽 홈페이지

## 프로젝트 개요

### 서비스 소개
하우스픽은 줄눈시공, 입주청소, 탄성코트, 화장실 리모델링 전문 서비스 플랫폼이다.

### 핵심 가치
- **정찰제 가격**: 현장 추가비용 없음
- **팀장 직영 시공**: 하도급 없음
- **100% 정품 자재**: 케라폭시 줄눈 등
- **12개월 AS 보증**

### 타겟 고객
- 20~40대 여성
- 프리미엄/위생/신뢰 중시
- 완전 비대면 예약 선호

### 연락처
- 전화: 010-6461-0131 (문자 상담)

---

## 디자인 톤앤매너

### 색상 팔레트
```css
:root {
  --primary-color: #6B5B95;    /* 자주색 - 주요 UI, 버튼, 링크 */
  --secondary-color: #F7F7F7;  /* 밝은 회색 - 배경, 섹션 구분 */
  --accent-color: #88B04B;     /* 초록색 - 할인 배너, 친환경 강조 */
  --text-color: #2C3E50;       /* 진한 파랑회색 - 본문 텍스트 */
  --white: #FFFFFF;
  --border-color: #E0E0E0;     /* 연한 회색 - 테두리, 구분선 */
}
```

### 폰트
- **주 폰트**: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif
- **본문 크기**: 16px (모바일 최소 16px)
- **라인 높이**: 1.7
- **제목**: font-weight 700, 계층별 크기 차등

### 컴포넌트 스타일

#### 버튼
```css
.btn-primary {
  background: var(--primary-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  transition: transform 0.2s, background 0.2s;
}
.btn-primary:hover {
  background: #5a4a84;
  transform: translateY(-2px);
}
.btn-outline {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}
.btn-large {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}
```

#### 카드
```css
.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
```

#### 그리드
```css
.grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

#### 반응형 브레이크포인트
```css
/* 모바일 */
@media (max-width: 767px) { }
/* 태블릿 */
@media (min-width: 768px) and (max-width: 1023px) { }
/* 데스크톱 */
@media (min-width: 1024px) { }
```

---

## 기술 스택

### 현재 사용 중
| 영역 | 기술 |
|------|------|
| 런타임 | Node.js |
| 프레임워크 | Express.js |
| 템플릿 | EJS |
| 데이터 저장 | JSON 파일 |
| 세션 | express-session |
| ID 생성 | uuid |

### 파일 구조
```
website/
├── server.js              # Express 서버 (라우팅, API)
├── views/                 # EJS 템플릿
│   ├── layout.ejs
│   ├── index.ejs
│   ├── service.ejs
│   ├── reservation.ejs
│   ├── blog.ejs
│   ├── partials/
│   └── admin/
├── public/
│   ├── css/
│   │   ├── style.css      # 메인 스타일
│   │   └── admin.css
│   ├── js/
│   │   ├── main.js
│   │   └── reservation.js # 예약 로직
│   └── images/
└── data/                  # JSON 데이터
    ├── reservations.json
    ├── reviews.json
    ├── posts.json
    └── settings.json
```

---

## 사이트 구조

### URL 구조
```
/                           # 홈페이지
├── /julnoon               # 줄눈시공
├── /move-in-cleaning      # 입주청소
├── /elastic-coat          # 탄성코트
├── /bathroom-remodeling   # 화장실 리모델링
├── /:service/reviews      # 서비스별 후기
├── /reservation           # 온라인 예약 (6단계)
├── /blog                  # 블로그 목록
├── /blog/:id              # 블로그 상세
├── /:region               # 지역 페이지 (서울, 경기, 인천, 부산)
├── /:region/:service      # 지역별 서비스
├── /:region/:district/:apartment  # 아파트 단지 페이지 (신규)
└── /admin/*               # 관리자 페이지
```

### 관리자 페이지
```
/admin/login               # 로그인
/admin                     # 대시보드
/admin/reservations        # 예약 관리
/admin/reviews             # 후기 관리
/admin/posts               # 블로그 관리
/admin/posts/new           # 새 포스트
/admin/posts/:id/edit      # 포스트 수정
```

---

## 현재 진행 중인 작업 (2026-03)

### 아파트 단지별 SEO 페이지 자동 생성 프로젝트

**배경**
네이버 검색에서 "아파트명 + 줄눈시공" 키워드로 사이트 영역 최상단 노출이 확인됨.
수도권 6000개 아파트 단지별 롱테일 SEO 페이지를 자동 생성하는 시스템 구축 중.

**작업 지시서**: `claude-code-prompt-v2.md` 파일 반드시 먼저 읽을 것.

**핵심 설계 원칙**
- 라우트는 전체 6000개 전부 동작 (직접 URL 접근 항상 가능)
- sitemap.xml은 Phase별로 단계적 노출 (스팸 신호 방지)
- 한 번 배포 후 Vercel Cron이 3주마다 자동으로 다음 Phase 전환

**새로 추가되는 URL 구조**
```
/:region/:district/:apartment    # 아파트 단지 페이지
예: /seoul/gangdong/godeok-raemian-hilstate
```

**새로 추가되는 파일 목록**
```
website/
├── 6000개아파트명.xlsx          # 원본 데이터 (레포 루트)
├── claude-code-prompt-v2.md    # 작업 지시서
├── vercel.json                 # Cron Job 설정
├── scripts/
│   └── parse-apartments.js    # 엑셀 → JSON 변환 스크립트
├── api/
│   └── advance-phase.js       # Phase 자동 전환 Cron API
├── data/
│   └── apartments.json        # 파싱 결과물 (6000개 단지)
└── views/
    └── apartment.ejs          # 아파트 단지 페이지 템플릿
```

**Phase 배포 전략**
| Phase | 지역 | 노출 시작 |
|---|---|---|
| 1 | 서울 강남/서초/송파/강동/마포/용산 | 즉시 |
| 2 | 서울 나머지 구 | 3주 후 자동 |
| 3 | 경기 주요 시 | 6주 후 자동 |
| 4 | 경기 나머지 + 인천 | 9주 후 자동 |

**타겟 키워드 구조**
- `[aptName] 줄눈시공` → title, H1
- `[districtName] [aptName] 줄눈` → 메타 디스크립션, 브레드크럼
- `[aptName] 줄눈시공업체` → H2 소제목
- `[aptName] 줄눈시공 전문업체` → CTA 섹션
- `[aptName] 줄눈시공 개선 사례` → 시공 과정 H2

**절대 금지 사항**
- server.js 기존 라우트 순서 변경 금지
- 기존 페이지 동작 수정 금지
- 새 라우트는 반드시 `/:region/:service?` (414줄) 바로 위에 삽입

---

## 앞으로 만들 페이지/기능

### 우선순위 높음
| 기능 | 설명 |
|------|------|
| 이미지 에셋 | 서비스 사진, Before/After, 시공 사례 |
| sitemap.xml | 동적 사이트맵 생성 |
| robots.txt | 크롤러 설정 |
| 후기 제출 폼 | 고객이 직접 후기 작성 |
| 이메일 알림 | 예약 확인, 입금 안내 발송 |

### 우선순위 중간
| 기능 | 설명 |
|------|------|
| SMS 알림 | 예약/시공 알림 문자 발송 |
| 회원 시스템 | 회원가입, 로그인, 마이페이지 |
| 검색 기능 | 블로그/서비스 검색 |
| 시공 사례 갤러리 | Before/After 이미지 갤러리 |
| 문의/상담 페이지 | 별도 상담 신청 폼 |

### 우선순위 낮음 (프로덕션 전)
| 기능 | 설명 |
|------|------|
| DB 마이그레이션 | MongoDB 또는 PostgreSQL |
| 결제 연동 | 계약금 온라인 결제 (카카오페이 등) |
| 보안 강화 | bcrypt 적용, CSRF 토큰, HTTPS |
| 입금 자동 확인 | 가상계좌/토스페이먼츠 연동 |

### 확장 페이지 (설계 문서 기반)
| 페이지 | 설명 |
|--------|------|
| 전국 지역 페이지 | 시/도/구 단위 자동 생성 |
| 서비스별 가이드 | /julnoon/guide 등 상세 가이드 |
| FAQ 페이지 | 자주 묻는 질문 |
| About 페이지 | 회사/팀 소개 |
| 가격표 페이지 | 서비스별 상세 가격 안내 |

---

## 개발 환경

### 시작 명령어
```bash
cd website
npm install
npm run dev     # 개발 모드 (nodemon)
npm start       # 프로덕션 모드
```

### 관리자 접속
- URL: http://localhost:3000/admin/login
- ID: admin
- PW: admin123

---

## 수정 필요 사항 (보안)

| 항목 | 현재 | 수정 필요 |
|------|------|---------|
| 관리자 암호 | 하드코딩 (admin123) | bcrypt 해시 + 환경변수 |
| 세션 시크릿 | 하드코딩 | 환경변수 |
| HTTPS | 미설정 | 프로덕션 필수 |
