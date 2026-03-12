# Phase 재분배 작업 지시서

## 문제
현재 Phase 분포가 아래와 같이 심하게 쏠려있음:
- Phase 1: 314개 (7%)
- Phase 2: 696개 (16%)
- Phase 3: 906개 (21%)
- Phase 4: 2,318개 (55%) ← 너무 많음

9주 뒤에 2,318개가 한 번에 노출되면 스팸 신호로 읽힐 수 있음.
전체 4,234개를 **균등하게 6개 Phase로 재분배**할 것.

---

## 목표 분포

총 4,234개를 6개 Phase로 균등 분배 (Phase당 약 700개):

| Phase | 목표 규모 | 노출 시작 | 지역 기준 |
|---|---|---|---|
| 1 | ~700개 | 즉시 | 서울 핵심구 (강남/서초/송파/강동/마포/용산/성동/광진) |
| 2 | ~700개 | 3주 후 | 서울 나머지 구 전반부 |
| 3 | ~700개 | 6주 후 | 서울 나머지 구 후반부 |
| 4 | ~700개 | 9주 후 | 경기 주요 시 (수원/성남/용인/고양/부천) |
| 5 | ~700개 | 12주 후 | 경기 나머지 시 전반부 |
| 6 | ~734개 | 15주 후 | 경기 나머지 시 후반부 + 인천 전체 |

---

## 작업 내용

### 1. parse-apartments.js 수정
`assignPhase()` 함수를 아래 로직으로 교체:

```javascript
function assignPhase(region, districtName) {
  // Phase 1: 서울 핵심구
  const phase1Districts = ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구', '성동구', '광진구'];
  // Phase 2: 서울 나머지 전반부
  const phase2Districts = ['종로구', '중구', '서대문구', '은평구', '노원구', '도봉구', '강북구', '성북구'];
  // Phase 3: 서울 나머지 후반부
  const phase3Districts = ['중랑구', '동대문구', '동작구', '관악구', '금천구', '구로구', '양천구', '강서구', '영등포구'];
  // Phase 4: 경기 주요 시
  const phase4Cities = ['수원시', '성남시', '용인시', '고양시', '부천시'];
  // Phase 5: 경기 나머지 전반부
  const phase5Cities = ['화성시', '남양주시', '안산시', '안양시', '의정부시', '평택시', '시흥시'];
  // Phase 6: 경기 나머지 후반부 + 인천 전체

  if (region === 'seoul') {
    if (phase1Districts.some(d => districtName.includes(d))) return 1;
    if (phase2Districts.some(d => districtName.includes(d))) return 2;
    if (phase3Districts.some(d => districtName.includes(d))) return 3;
    return 2; // 위에 없는 서울 구는 Phase 2로
  }
  if (region === 'gyeonggi') {
    if (phase4Cities.some(c => districtName.includes(c))) return 4;
    if (phase5Cities.some(c => districtName.includes(c))) return 5;
    return 6;
  }
  if (region === 'incheon') return 6;
  return 6;
}
```

### 2. 스크립트 재실행
```bash
node scripts/parse-apartments.js
```

실행 후 아래 통계를 반드시 출력할 것:
```
Phase별 분포:
- Phase 1: N개
- Phase 2: N개
- Phase 3: N개
- Phase 4: N개
- Phase 5: N개
- Phase 6: N개
- 합계: N개
```

Phase당 편차가 ±200개 이내인지 확인. 편차가 크면 district 배정을 조정할 것.

### 3. settings.json 업데이트
Phase가 6개로 늘었으므로 스케줄 업데이트:

```json
{
  "currentPhase": 1,
  "phaseStartDate": "오늘 날짜 자동 입력",
  "phaseSchedule": {
    "1": "즉시",
    "2": "3주 후",
    "3": "6주 후",
    "4": "9주 후",
    "5": "12주 후",
    "6": "15주 후"
  },
  "totalPhases": 6
}
```

### 4. advance-phase.js 수정
최대 Phase를 4에서 6으로 변경:

```javascript
const targetPhase = Math.min(Math.floor(weeksPassed / 3) + 1, 6); // 4 → 6
```

### 5. sitemap.xml 확인
Phase 필터 로직은 `apt.phase <= currentPhase` 그대로 유지. 변경 불필요.

---

## 성공 기준

| 확인 항목 | 기대값 |
|---|---|
| Phase별 편차 | ±200개 이내 |
| Phase 1 sitemap URL 수 | 600~800개 |
| Phase 6 아파트 직접 URL 접근 | 정상 렌더링 |
| settings.json totalPhases | 6 |
| advance-phase.js 최대값 | 6 |
| 전체 합계 | 4,234개 (누락 없음) |
