/**
 * 입주예정정보 186개를 apartments.json에 추가하는 스크립트
 * 실행: node scripts/add-upcoming-apartments.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 한글 → 로마자 변환 (기존 방식과 동일)
function koreanToSlug(text) {
  const romanMap = {
    '가': 'ga', '나': 'na', '다': 'da', '라': 'ra', '마': 'ma', '바': 'ba', '사': 'sa', '아': 'a', '자': 'ja', '차': 'cha', '카': 'ka', '타': 'ta', '파': 'pa', '하': 'ha',
    '거': 'geo', '너': 'neo', '더': 'deo', '러': 'reo', '머': 'meo', '버': 'beo', '서': 'seo', '어': 'eo', '저': 'jeo', '처': 'cheo', '커': 'keo', '터': 'teo', '퍼': 'peo', '허': 'heo',
    '고': 'go', '노': 'no', '도': 'do', '로': 'ro', '모': 'mo', '보': 'bo', '소': 'so', '오': 'o', '조': 'jo', '초': 'cho', '코': 'ko', '토': 'to', '포': 'po', '호': 'ho',
    '구': 'gu', '누': 'nu', '두': 'du', '루': 'ru', '무': 'mu', '부': 'bu', '수': 'su', '우': 'u', '주': 'ju', '추': 'chu', '쿠': 'ku', '투': 'tu', '푸': 'pu', '후': 'hu',
    '그': 'geu', '느': 'neu', '드': 'deu', '르': 'reu', '므': 'meu', '브': 'beu', '스': 'seu', '으': 'eu', '즈': 'jeu', '츠': 'cheu', '크': 'keu', '트': 'teu', '프': 'peu', '흐': 'heu',
    '기': 'gi', '니': 'ni', '디': 'di', '리': 'ri', '미': 'mi', '비': 'bi', '시': 'si', '이': 'i', '지': 'ji', '치': 'chi', '키': 'ki', '티': 'ti', '피': 'pi', '히': 'hi',
    '개': 'gae', '내': 'nae', '대': 'dae', '래': 'rae', '매': 'mae', '배': 'bae', '새': 'sae', '애': 'ae', '재': 'jae', '채': 'chae', '캐': 'kae', '태': 'tae', '패': 'pae', '해': 'hae',
    '게': 'ge', '네': 'ne', '데': 'de', '레': 're', '메': 'me', '베': 'be', '세': 'se', '에': 'e', '제': 'je', '체': 'che', '케': 'ke', '테': 'te', '페': 'pe', '헤': 'he',
    '계': 'gye', '녜': 'nye', '뎨': 'dye', '례': 'rye', '몌': 'mye', '볘': 'bye', '셰': 'sye', '예': 'ye', '졔': 'jye', '쳬': 'chye', '켸': 'kye', '톄': 'tye', '폐': 'pye', '혜': 'hye',
    '과': 'gwa', '놔': 'nwa', '돠': 'dwa', '롸': 'rwa', '뫄': 'mwa', '봐': 'bwa', '솨': 'swa', '와': 'wa', '좌': 'jwa', '촤': 'chwa', '콰': 'kwa', '톼': 'twa', '퐈': 'pwa', '화': 'hwa',
    '괘': 'gwae', '놰': 'nwae', '돼': 'dwae', '뢔': 'rwae', '뫠': 'mwae', '봬': 'bwae', '쇄': 'swae', '왜': 'wae', '좨': 'jwae', '쵀': 'chwae', '쾌': 'kwae', '퇘': 'twae', '퐤': 'pwae', '홰': 'hwae',
    '괴': 'goe', '뇌': 'noe', '되': 'doe', '뢰': 'roe', '뫼': 'moe', '뵈': 'boe', '쇠': 'soe', '외': 'oe', '죄': 'joe', '최': 'choe', '쾨': 'koe', '퇴': 'toe', '푀': 'poe', '회': 'hoe',
    '교': 'gyo', '뇨': 'nyo', '됴': 'dyo', '료': 'ryo', '묘': 'myo', '뵤': 'byo', '쇼': 'syo', '요': 'yo', '죠': 'jyo', '쵸': 'chyo', '쿄': 'kyo', '툐': 'tyo', '표': 'pyo', '효': 'hyo',
    '규': 'gyu', '뉴': 'nyu', '듀': 'dyu', '류': 'ryu', '뮤': 'myu', '뷰': 'byu', '슈': 'syu', '유': 'yu', '쥬': 'jyu', '츄': 'chyu', '큐': 'kyu', '튜': 'tyu', '퓨': 'pyu', '휴': 'hyu',
    '귀': 'gwi', '뉘': 'nwi', '뒤': 'dwi', '뤼': 'rwi', '뮈': 'mwi', '뷔': 'bwi', '쉬': 'swi', '위': 'wi', '쥐': 'jwi', '취': 'chwi', '퀴': 'kwi', '튀': 'twi', '퓌': 'pwi', '휘': 'hwi',
    '의': 'ui',
    '간': 'gan', '난': 'nan', '단': 'dan', '란': 'ran', '만': 'man', '반': 'ban', '산': 'san', '안': 'an', '잔': 'jan', '찬': 'chan', '칸': 'kan', '탄': 'tan', '판': 'pan', '한': 'han',
    '강': 'gang', '낭': 'nang', '당': 'dang', '랑': 'rang', '망': 'mang', '방': 'bang', '상': 'sang', '앙': 'ang', '장': 'jang', '창': 'chang', '캉': 'kang', '탕': 'tang', '팡': 'pang', '항': 'hang',
    '건': 'geon', '넌': 'neon', '던': 'deon', '런': 'reon', '먼': 'meon', '번': 'beon', '선': 'seon', '언': 'eon', '전': 'jeon', '천': 'cheon', '컨': 'keon', '턴': 'teon', '펀': 'peon', '헌': 'heon',
    '경': 'gyeong', '녕': 'nyeong', '덩': 'deong', '령': 'ryeong', '명': 'myeong', '병': 'byeong', '성': 'seong', '영': 'yeong', '정': 'jeong', '청': 'cheong', '켕': 'keong', '텅': 'teong', '평': 'pyeong', '형': 'hyeong',
    '곤': 'gon', '논': 'non', '돈': 'don', '론': 'ron', '몬': 'mon', '본': 'bon', '손': 'son', '온': 'on', '존': 'jon', '촌': 'chon', '콘': 'kon', '톤': 'ton', '폰': 'pon', '혼': 'hon',
    '공': 'gong', '농': 'nong', '동': 'dong', '롱': 'rong', '몽': 'mong', '봉': 'bong', '송': 'song', '옹': 'ong', '종': 'jong', '총': 'chong', '콩': 'kong', '통': 'tong', '퐁': 'pong', '홍': 'hong',
    '군': 'gun', '눈': 'nun', '둔': 'dun', '룬': 'run', '문': 'mun', '분': 'bun', '순': 'sun', '운': 'un', '준': 'jun', '춘': 'chun', '쿤': 'kun', '툰': 'tun', '푼': 'pun', '훈': 'hun',
    '궁': 'gung', '눙': 'nung', '둥': 'dung', '룽': 'rung', '뭉': 'mung', '붕': 'bung', '숭': 'sung', '웅': 'ung', '중': 'jung', '충': 'chung', '쿵': 'kung', '퉁': 'tung', '풍': 'pung', '흉': 'hyung',
    '근': 'geun', '는': 'neun', '든': 'deun', '른': 'reun', '믄': 'meun', '븐': 'beun', '슨': 'seun', '은': 'eun', '즌': 'jeun', '츤': 'cheun', '큰': 'keun', '튼': 'teun', '픈': 'peun', '흔': 'heun',
    '긍': 'geung', '능': 'neung', '등': 'deung', '릉': 'reung', '믕': 'meung', '븅': 'beung', '승': 'seung', '응': 'eung', '증': 'jeung', '층': 'cheung', '큭': 'keung', '틍': 'teung', '픙': 'peung', '흥': 'heung',
    '긴': 'gin', '닌': 'nin', '딘': 'din', '린': 'rin', '민': 'min', '빈': 'bin', '신': 'sin', '인': 'in', '진': 'jin', '친': 'chin', '킨': 'kin', '틴': 'tin', '핀': 'pin', '힌': 'hin',
    '김': 'gim', '님': 'nim', '딤': 'dim', '림': 'rim', '밈': 'mim', '빔': 'bim', '심': 'sim', '임': 'im', '짐': 'jim', '침': 'chim', '킴': 'kim', '팀': 'tim', '핌': 'pim', '힘': 'him',
    '깅': 'ging', '닝': 'ning', '딩': 'ding', '링': 'ring', '밍': 'ming', '빙': 'bing', '싱': 'sing', '잉': 'ing', '징': 'jing', '칭': 'ching', '킹': 'king', '팅': 'ting', '핑': 'ping', '힝': 'hing',
    '갈': 'gal', '날': 'nal', '달': 'dal', '랄': 'ral', '말': 'mal', '발': 'bal', '살': 'sal', '알': 'al', '잘': 'jal', '찰': 'chal', '칼': 'kal', '탈': 'tal', '팔': 'pal', '할': 'hal',
    '걸': 'geol', '널': 'neol', '덜': 'deol', '럴': 'reol', '멀': 'meol', '벌': 'beol', '설': 'seol', '얼': 'eol', '절': 'jeol', '철': 'cheol', '컬': 'keol', '털': 'teol', '펄': 'peol', '헐': 'heol',
    '골': 'gol', '놀': 'nol', '돌': 'dol', '롤': 'rol', '몰': 'mol', '볼': 'bol', '솔': 'sol', '올': 'ol', '졸': 'jol', '촐': 'chol', '콜': 'kol', '톨': 'tol', '폴': 'pol', '홀': 'hol',
    '굴': 'gul', '눌': 'nul', '둘': 'dul', '룰': 'rul', '물': 'mul', '불': 'bul', '술': 'sul', '울': 'ul', '줄': 'jul', '출': 'chul', '쿨': 'kul', '툴': 'tul', '풀': 'pul', '훌': 'hul',
    '글': 'geul', '늘': 'neul', '들': 'deul', '를': 'reul', '믈': 'meul', '블': 'beul', '슬': 'seul', '을': 'eul', '즐': 'jeul', '츨': 'cheul', '클': 'keul', '틀': 'teul', '플': 'peul', '흘': 'heul',
    '길': 'gil', '닐': 'nil', '딜': 'dil', '릴': 'ril', '밀': 'mil', '빌': 'bil', '실': 'sil', '일': 'il', '질': 'jil', '칠': 'chil', '킬': 'kil', '틸': 'til', '필': 'pil', '힐': 'hil',
    '감': 'gam', '남': 'nam', '담': 'dam', '람': 'ram', '맘': 'mam', '밤': 'bam', '삼': 'sam', '암': 'am', '잠': 'jam', '참': 'cham', '캄': 'kam', '탐': 'tam', '팜': 'pam', '함': 'ham',
    '겸': 'gyeom', '념': 'nyeom', '뎜': 'dyeom', '렴': 'ryeom', '몜': 'myeom', '볨': 'byeom', '셤': 'syeom', '염': 'yeom', '졈': 'jyeom', '쳠': 'chyeom', '켬': 'kyeom', '톰': 'tyeom', '폄': 'pyeom', '혐': 'hyeom',
    '곰': 'gom', '놈': 'nom', '돔': 'dom', '롬': 'rom', '몸': 'mom', '봄': 'bom', '솜': 'som', '옴': 'om', '좀': 'jom', '촘': 'chom', '콤': 'kom', '톰': 'tom', '폼': 'pom', '홈': 'hom',
    '굼': 'gum', '눔': 'num', '둠': 'dum', '룸': 'rum', '뭄': 'mum', '붐': 'bum', '숨': 'sum', '움': 'um', '줌': 'jum', '춤': 'chum', '쿰': 'kum', '툼': 'tum', '품': 'pum', '훔': 'hum',
    '금': 'geum', '늠': 'neum', '듬': 'deum', '름': 'reum', '믐': 'meum', '븜': 'beum', '슴': 'seum', '음': 'eum', '즘': 'jeum', '츰': 'cheum', '큼': 'keum', '틈': 'teum', '픔': 'peum', '흠': 'heum',
    '갑': 'gap', '납': 'nap', '답': 'dap', '랍': 'rap', '맙': 'map', '밥': 'bap', '삽': 'sap', '압': 'ap', '잡': 'jap', '찹': 'chap', '캅': 'kap', '탑': 'tap', '팝': 'pap', '합': 'hap',
    '겁': 'geop', '넙': 'neop', '덥': 'deop', '럽': 'reop', '멉': 'meop', '법': 'beop', '섭': 'seop', '업': 'eop', '접': 'jeop', '첩': 'cheop', '컵': 'keop', '텁': 'teop', '펍': 'peop', '헙': 'heop',
    '곱': 'gop', '놉': 'nop', '돕': 'dop', '롭': 'rop', '몹': 'mop', '봅': 'bop', '솝': 'sop', '옵': 'op', '좁': 'jop', '촙': 'chop', '콥': 'kop', '톱': 'top', '폽': 'pop', '홉': 'hop',
    '굽': 'gup', '눕': 'nup', '둡': 'dup', '룹': 'rup', '뭅': 'mup', '붑': 'bup', '숩': 'sup', '웁': 'up', '줍': 'jup', '춥': 'chup', '쿱': 'kup', '툽': 'tup', '풉': 'pup', '훕': 'hup',
    '급': 'geup', '늡': 'neup', '듭': 'deup', '릅': 'reup', '믑': 'meup', '븝': 'beup', '습': 'seup', '읍': 'eup', '즙': 'jeup', '츱': 'cheup', '큽': 'keup', '틉': 'teup', '픕': 'peup', '흡': 'heup',
    '깁': 'gip', '닙': 'nip', '딥': 'dip', '립': 'rip', '밉': 'mip', '빕': 'bip', '십': 'sip', '입': 'ip', '집': 'jip', '칩': 'chip', '킵': 'kip', '팁': 'tip', '핍': 'pip', '힙': 'hip',
    '각': 'gak', '낙': 'nak', '닥': 'dak', '락': 'rak', '막': 'mak', '박': 'bak', '삭': 'sak', '악': 'ak', '작': 'jak', '착': 'chak', '칵': 'kak', '탁': 'tak', '팍': 'pak', '학': 'hak',
    '객': 'gaek', '낵': 'naek', '댁': 'daek', '랙': 'raek', '맥': 'maek', '백': 'baek', '색': 'saek', '액': 'aek', '잭': 'jaek', '책': 'chaek', '캑': 'kaek', '택': 'taek', '팩': 'paek', '핵': 'haek',
    '격': 'gyeok', '녁': 'nyeok', '덕': 'deok', '력': 'ryeok', '멱': 'myeok', '벽': 'byeok', '석': 'seok', '역': 'yeok', '적': 'jeok', '척': 'cheok', '켁': 'keok', '텍': 'teok', '펙': 'peok', '혁': 'hyeok',
    '곡': 'gok', '녹': 'nok', '독': 'dok', '록': 'rok', '목': 'mok', '복': 'bok', '속': 'sok', '옥': 'ok', '족': 'jok', '촉': 'chok', '콕': 'kok', '톡': 'tok', '폭': 'pok', '혹': 'hok',
    '국': 'guk', '눅': 'nuk', '둑': 'duk', '룩': 'ruk', '묵': 'muk', '북': 'buk', '숙': 'suk', '욱': 'uk', '죽': 'juk', '축': 'chuk', '쿡': 'kuk', '툭': 'tuk', '푹': 'puk', '훅': 'huk',
    '극': 'geuk', '늑': 'neuk', '득': 'deuk', '륵': 'reuk', '믁': 'meuk', '븍': 'beuk', '슥': 'seuk', '윽': 'euk', '즉': 'jeuk', '측': 'cheuk', '큭': 'keuk', '특': 'teuk', '픅': 'peuk', '흑': 'heuk',
    '긱': 'gik', '닉': 'nik', '딕': 'dik', '릭': 'rik', '믹': 'mik', '빅': 'bik', '식': 'sik', '익': 'ik', '직': 'jik', '칙': 'chik', '킥': 'kik', '틱': 'tik', '픽': 'pik', '힉': 'hik',
    '엘': 'el', '르': 'reu', '워': 'wo', '웨': 'we', '월': 'wol', '웍': 'wok',
    '뉴': 'nyu', '듀': 'dyu', '류': 'ryu', '뮤': 'myu', '뷰': 'byu', '슈': 'syu', '유': 'yu', '쥬': 'jyu', '츄': 'chyu', '큐': 'kyu', '튜': 'tyu', '퓨': 'pyu', '휴': 'hyu',
    '벨': 'bel', '델': 'del', '젤': 'jel', '셀': 'sel', '텔': 'tel', '펠': 'pel', '헬': 'hel', '멜': 'mel', '넬': 'nel', '렐': 'rel',
    '랜': 'raen', '밴': 'baen', '샌': 'saen', '잰': 'jaen', '캔': 'kaen', '탠': 'taen', '팬': 'paen', '핸': 'haen', '맨': 'maen', '넨': 'naen', '덴': 'den', '렌': 'ren',
    '쌍': 'ssang', '짜': 'jja', '빠': 'ppa', '싸': 'ssa', '까': 'kka', '따': 'tta',
    '원': 'won', '웬': 'wen', '왼': 'oen',
  }

  let result = ''
  for (const char of text) {
    if (romanMap[char]) {
      result += romanMap[char]
    } else if (/[a-zA-Z0-9]/.test(char)) {
      result += char.toLowerCase()
    } else if (char === ' ' || char === '-') {
      result += '-'
    }
    // 괄호, 특수문자 등은 무시
  }

  // 연속 하이픈 제거, 앞뒤 하이픈 제거
  return result.replace(/-+/g, '-').replace(/^-|-$/g, '')
}

// 브랜드 추출
function extractBrand(name) {
  const brandRules = [
    { keyword: '자이', brand: 'GS건설' },
    { keyword: '래미안', brand: '삼성물산' },
    { keyword: '힐스테이트', brand: '현대건설' },
    { keyword: '푸르지오', brand: '대우건설' },
    { keyword: 'e편한세상', brand: 'DL이앤씨' },
    { keyword: '아이파크', brand: 'HDC현대산업개발' },
    { keyword: '롯데캐슬', brand: '롯데건설' },
    { keyword: '더샵', brand: '포스코건설' },
    { keyword: '스위첸', brand: '대림산업' },
    { keyword: '금호어울림', brand: '금호건설' },
    { keyword: '제일풍경채', brand: '제일건설' },
    { keyword: '우미린', brand: '우미건설' },
    { keyword: '해링턴', brand: '효성중공업' },
    { keyword: '센트럴', brand: '기타' },
    { keyword: '반도유보라', brand: '반도건설' },
    { keyword: '한화포레나', brand: '한화건설' },
  ]

  for (const rule of brandRules) {
    if (name.includes(rule.keyword)) return rule.brand
  }
  return '미확인'
}

// 주소에서 region/district 추출
function extractLocation(address, regionName) {
  let region, districtName, districtSlug

  if (regionName === '서울') {
    region = 'seoul'
    const match = address.match(/서울특별시\s+([가-힣]+구)/)
    if (match) {
      districtName = match[1]
      districtSlug = districtNameToSlug(districtName, 'seoul')
    }
  } else if (regionName === '경기') {
    region = 'gyeonggi'
    const match = address.match(/경기도\s+([가-힣]+[시군])/)
    if (match) {
      districtName = match[1]
      districtSlug = districtNameToSlug(districtName, 'gyeonggi')
    }
  } else if (regionName === '인천') {
    region = 'incheon'
    const match = address.match(/인천광역시\s+([가-힣]+구)/)
    if (match) {
      districtName = match[1]
      districtSlug = districtNameToSlug(districtName, 'incheon')
    }
  }

  return { region, districtName, districtSlug }
}

// 구/시 이름 → slug 변환
function districtNameToSlug(name, region) {
  const seoulMap = {
    '강남구': 'gangnam', '강동구': 'gangdong', '강북구': 'gangbuk', '강서구': 'gangseo',
    '관악구': 'gwanak', '광진구': 'gwangjin', '구로구': 'guro', '금천구': 'geumcheon',
    '노원구': 'nowon', '도봉구': 'dobong', '동대문구': 'dongdaemun', '동작구': 'dongjak',
    '마포구': 'mapo', '서대문구': 'seodaemun', '서초구': 'seocho', '성동구': 'seongdong',
    '성북구': 'seongbuk', '송파구': 'songpa', '양천구': 'yangcheon', '영등포구': 'yeongdeungpo',
    '용산구': 'yongsan', '은평구': 'eunpyeong', '종로구': 'jongno', '중구': 'jung',
    '중랑구': 'jungnang'
  }

  const gyeonggiMap = {
    '수원시': 'suwon', '성남시': 'seongnam', '용인시': 'yongin', '부천시': 'bucheon',
    '안산시': 'ansan', '안양시': 'anyang', '남양주시': 'namyangju', '화성시': 'hwaseong',
    '평택시': 'pyeongtaek', '시흥시': 'siheung', '김포시': 'gimpo', '광명시': 'gwangmyeong',
    '광주시': 'gwangju', '군포시': 'gunpo', '하남시': 'hanam', '오산시': 'osan',
    '이천시': 'icheon', '안성시': 'anseong', '의왕시': 'uiwang', '구리시': 'guri',
    '의정부시': 'uijeongbu', '고양시': 'goyang', '파주시': 'paju', '양주시': 'yangju',
    '포천시': 'pocheon', '과천시': 'gwacheon', '동두천시': 'dongducheon', '여주시': 'yeoju',
    '연천군': 'yeoncheon', '가평군': 'gapyeong', '양평군': 'yangpyeong'
  }

  const incheonMap = {
    '중구': 'junggu', '동구': 'donggu', '미추홀구': 'michuhol', '연수구': 'yeonsu',
    '남동구': 'namdong', '부평구': 'bupyeong', '계양구': 'gyeyang', '서구': 'seogu',
    '강화군': 'ganghwa', '옹진군': 'ongjin'
  }

  if (region === 'seoul') return seoulMap[name] || koreanToSlug(name)
  if (region === 'gyeonggi') return gyeonggiMap[name] || koreanToSlug(name)
  if (region === 'incheon') return incheonMap[name] || koreanToSlug(name)
  return koreanToSlug(name)
}

// 엑셀 날짜 → JS Date
function excelDateToDate(serial) {
  if (!serial || typeof serial !== 'number') return null
  return new Date((serial - 25569) * 86400 * 1000)
}

// 메인 실행
async function main() {
  console.log('=== 입주예정정보 추가 스크립트 시작 ===\n')

  // 1. 기존 apartments.json 로드
  const apartmentsPath = path.join(__dirname, '..', 'data', 'apartments.json')
  const apartments = JSON.parse(fs.readFileSync(apartmentsPath, 'utf-8'))

  // 기존 개수 계산
  let existingCount = 0
  for (const districts of Object.values(apartments)) {
    for (const districtData of Object.values(districts)) {
      existingCount += districtData.apartments.length
    }
  }
  console.log('기존 아파트 수:', existingCount)

  // 2. 엑셀 파일 로드
  const xlsxPath = path.join(__dirname, '..', '20260317 입주예정정보.xlsx')
  const wb = XLSX.readFile(xlsxPath)
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

  // 서울/경기/인천 + 분양만 필터링
  const filtered = data.filter((row, i) => {
    if (i === 0) return false
    const region = row[1]
    const type = row[2]
    return (region === '서울' || region === '경기' || region === '인천') && type === '분양'
  })

  console.log('입주예정 단지 수 (서울/경기/인천 분양):', filtered.length)

  // 3. 변환 및 추가
  let addedCount = 0
  let skippedCount = 0
  const addedByRegion = { seoul: 0, gyeonggi: 0, incheon: 0 }

  for (const row of filtered) {
    const excelDate = row[0]
    const regionName = row[1]
    const address = row[3]
    const aptName = row[4]
    const households = row[5]

    // 날짜 변환
    const moveInDate = excelDateToDate(excelDate)
    if (!moveInDate) {
      skippedCount++
      continue
    }

    const year = moveInDate.getFullYear()
    const month = moveInDate.getMonth() + 1

    // 위치 추출
    const { region, districtName, districtSlug } = extractLocation(address, regionName)
    if (!region || !districtSlug) {
      console.log('  위치 추출 실패:', address)
      skippedCount++
      continue
    }

    // slug 생성
    let slug = koreanToSlug(aptName)
    if (!slug) {
      skippedCount++
      continue
    }

    // 브랜드 추출
    const brand = extractBrand(aptName)

    // district가 없으면 생성
    if (!apartments[region]) {
      apartments[region] = {}
    }
    if (!apartments[region][districtSlug]) {
      apartments[region][districtSlug] = {
        name: districtName,
        apartments: []
      }
    }

    // 중복 체크 (같은 slug가 있으면 -upcoming 추가)
    const existingSlugs = apartments[region][districtSlug].apartments.map(a => a.slug)
    if (existingSlugs.includes(slug)) {
      slug = slug + '-upcoming'
    }

    // 아파트 추가
    const newApt = {
      slug,
      name: aptName,
      households,
      year,
      month,
      brand,
      phase: 7,  // 입주예정은 phase 7
      isUpcoming: true,
      recentMoveIn: {
        year,
        month,
        units: households
      }
    }

    apartments[region][districtSlug].apartments.push(newApt)
    addedCount++
    addedByRegion[region]++
  }

  // 4. 저장
  fs.writeFileSync(apartmentsPath, JSON.stringify(apartments, null, 2))

  // 5. 최종 개수 확인
  let finalCount = 0
  for (const districts of Object.values(apartments)) {
    for (const districtData of Object.values(districts)) {
      finalCount += districtData.apartments.length
    }
  }

  console.log('\n=== 결과 ===')
  console.log('추가된 아파트 수:', addedCount)
  console.log('  서울:', addedByRegion.seoul)
  console.log('  경기:', addedByRegion.gyeonggi)
  console.log('  인천:', addedByRegion.incheon)
  console.log('스킵된 수:', skippedCount)
  console.log('')
  console.log('기존:', existingCount)
  console.log('추가:', addedCount)
  console.log('최종:', finalCount)
  console.log('예상:', existingCount + addedCount)
  console.log('일치:', finalCount === existingCount + addedCount ? '✅' : '❌')
}

main().catch(console.error)
