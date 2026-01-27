# 🏠 HousePick - 정찰제 줄눈시공

> "줄눈 가격, 이제 검색하지 마세요"  
> 가격도 정찰제, 품질도 5년 무상보장

## 📦 기술 스택

- React 18
- Vite 5
- Tailwind CSS 3

---

## 🚀 로컬 실행 방법

```bash
# 1. 패키지 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 확인
# http://localhost:5173
```

---

## 🌐 Vercel 무료 배포 방법

### Step 1: GitHub에 업로드

```bash
# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit - HousePick 웹사이트"

# GitHub에서 새 레포지토리 생성 후
git remote add origin https://github.com/YOUR_USERNAME/housepick-web.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel 연결

1. [vercel.com](https://vercel.com) 접속
2. **GitHub으로 로그인**
3. **"Add New Project"** 클릭
4. **GitHub 레포지토리 선택** (housepick-web)
5. **"Deploy"** 클릭
6. 끝! 🎉

### Step 3: 커스텀 도메인 연결 (선택)

1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Domains
3. 도메인 입력 (예: housepick.co.kr)
4. DNS 설정 안내에 따라 설정

---

## 📁 프로젝트 구조

```
housepick-web/
├── public/
│   ├── favicon.svg
│   └── images/
│       └── profile-kimdongahn.png
├── src/
│   ├── App.jsx          # 메인 컴포넌트
│   ├── main.jsx         # 엔트리 포인트
│   └── index.css        # Tailwind CSS
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🖼️ 이미지 추가 방법

`public/images/` 폴더에 이미지를 넣고, 컴포넌트에서 `/images/파일명.png`로 참조

```jsx
<img src="/images/before-after-1.jpg" alt="시공 전후" />
```

---

## ✏️ 수정이 필요한 항목

- [ ] 카카오톡 채널 URL (`https://pf.kakao.com/YOUR_CHANNEL`)
- [ ] 사업자 주소
- [ ] Before/After 시공 사진
- [ ] 고객 후기 내용

---

## 📞 문의

- 전화: 010-6461-0131
- 카카오톡: 하우스Pick 줄눈시공

---

© 2024 디테일라인. All rights reserved.
