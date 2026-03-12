# 전국 시공 전문 서비스 웹사이트

줄눈시공, 입주청소, 탄성코트, 화장실 리모델링 전문 서비스 웹사이트입니다.

## 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. 서버 실행
```bash
npm start
```

3. 개발 모드 (nodemon 사용)
```bash
npm run dev
```

서버는 http://localhost:3001 에서 실행됩니다.

**포트 변경:**
- 환경 변수: `PORT=8080 npm start`
- 또는 server.js에서 PORT 값을 변경

## 관리자 계정

- 사용자명: admin
- 비밀번호: admin123

## 주요 기능

- 홈페이지 및 서비스 페이지
- 지역별 페이지
- 온라인 예약 시스템
- 견적 자동 계산
- 패키지 할인 시스템
- 고객 후기 관리
- 관리자 대시보드
- 예약 관리
- 후기 승인/거부

## 프로젝트 구조

```
website/
├── server.js          # Express 서버
├── views/             # EJS 템플릿
│   ├── layout.ejs
│   ├── index.ejs
│   ├── service.ejs
│   ├── reservation.ejs
│   └── admin/
├── public/            # 정적 파일
│   ├── css/
│   ├── js/
│   └── images/
├── data/              # 데이터베이스 (JSON)
│   ├── reservations.json
│   ├── reviews.json
│   └── settings.json
└── package.json
```

## 데이터베이스

현재는 JSON 파일 기반으로 구현되어 있습니다. 프로덕션 환경에서는 MongoDB, PostgreSQL 등의 데이터베이스를 사용하는 것을 권장합니다.

