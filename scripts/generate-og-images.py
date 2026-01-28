#!/usr/bin/env python3
"""
OG 이미지 자동 생성 스크립트
템플릿 이미지 위에 52개 지역명을 합성하여 개별 파일로 저장
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 52개 지역 데이터
regions = [
    # 서울 (25개)
    {"slug": "gangnam", "label": "서울 강남구"},
    {"slug": "gangdong", "label": "서울 강동구"},
    {"slug": "gangbuk", "label": "서울 강북구"},
    {"slug": "gangseo", "label": "서울 강서구"},
    {"slug": "gwanak", "label": "서울 관악구"},
    {"slug": "gwangjin", "label": "서울 광진구"},
    {"slug": "guro", "label": "서울 구로구"},
    {"slug": "geumcheon", "label": "서울 금천구"},
    {"slug": "nowon", "label": "서울 노원구"},
    {"slug": "dobong", "label": "서울 도봉구"},
    {"slug": "dongdaemun", "label": "서울 동대문구"},
    {"slug": "dongjak", "label": "서울 동작구"},
    {"slug": "mapo", "label": "서울 마포구"},
    {"slug": "seodaemun", "label": "서울 서대문구"},
    {"slug": "seocho", "label": "서울 서초구"},
    {"slug": "seongdong", "label": "서울 성동구"},
    {"slug": "seongbuk", "label": "서울 성북구"},
    {"slug": "songpa", "label": "서울 송파구"},
    {"slug": "yangcheon", "label": "서울 양천구"},
    {"slug": "yeongdeungpo", "label": "서울 영등포구"},
    {"slug": "yongsan", "label": "서울 용산구"},
    {"slug": "eunpyeong", "label": "서울 은평구"},
    {"slug": "jongno", "label": "서울 종로구"},
    {"slug": "junggu-seoul", "label": "서울 중구"},
    {"slug": "jungnang", "label": "서울 중랑구"},
    # 경기도 (26개)
    {"slug": "suwon", "label": "경기 수원시"},
    {"slug": "seongnam", "label": "경기 성남시"},
    {"slug": "yongin", "label": "경기 용인시"},
    {"slug": "bucheon", "label": "경기 부천시"},
    {"slug": "ansan", "label": "경기 안산시"},
    {"slug": "anyang", "label": "경기 안양시"},
    {"slug": "namyangju", "label": "경기 남양주시"},
    {"slug": "hwaseong", "label": "경기 화성시"},
    {"slug": "pyeongtaek", "label": "경기 평택시"},
    {"slug": "siheung", "label": "경기 시흥시"},
    {"slug": "gimpo", "label": "경기 김포시"},
    {"slug": "gwangmyeong", "label": "경기 광명시"},
    {"slug": "gwangju-gg", "label": "경기 광주시"},
    {"slug": "gunpo", "label": "경기 군포시"},
    {"slug": "hanam", "label": "경기 하남시"},
    {"slug": "osan", "label": "경기 오산시"},
    {"slug": "icheon", "label": "경기 이천시"},
    {"slug": "anseong", "label": "경기 안성시"},
    {"slug": "uiwang", "label": "경기 의왕시"},
    {"slug": "guri", "label": "경기 구리시"},
    {"slug": "uijeongbu", "label": "경기 의정부시"},
    {"slug": "goyang", "label": "경기 고양시"},
    {"slug": "paju", "label": "경기 파주시"},
    {"slug": "yangju", "label": "경기 양주시"},
    {"slug": "pocheon", "label": "경기 포천시"},
    {"slug": "gwacheon", "label": "경기 과천시"},
    # 인천 (1개)
    {"slug": "incheon", "label": "인천"},
]

# 스크립트 경로 기준으로 프로젝트 루트 설정
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# 설정
TEMPLATE_PATH = os.path.join(PROJECT_ROOT, "public", "images", "og-template.png")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "images", "og")

# 폰트 경로 (Windows)
FONT_PATHS = [
    "C:/Windows/Fonts/NanumGothicBold.ttf",
    "C:/Windows/Fonts/NanumGothic-Bold.ttf",
    "C:/Windows/Fonts/malgunbd.ttf",  # 맑은 고딕 Bold
    "C:/Windows/Fonts/malgun.ttf",     # 맑은 고딕
]

# 스타일 설정
FONT_SIZE = 24
TEXT_COLOR = "#1C5D58"
BG_COLOR = "#F5F5F5"
BORDER_COLOR = "#1C5D58"

# 원본 "서울 강남구" 박스 위치
# 이미지 해상도: 1195x625
# 원본 박스: HousePick 로고 아래, "정찰제" 위에 위치
# 약 x:57, y:127 ~ x:170, y:167 (테두리 박스)
ORIG_BOX_X1, ORIG_BOX_Y1 = 57, 127
ORIG_BOX_X2, ORIG_BOX_Y2 = 170, 167

BOX_RADIUS = 6

# 텍스트 시작점 (박스 내부 중앙 정렬 기준)
TEXT_PADDING = 10

# 원본 텍스트 영역 전체를 덮을 범위 (박스 + 여유 공간)
# "서울 강남구" 박스와 새 지역 박스 모두 포함
# y:115 ~ y:210 범위로 넓게 설정
CLEAR_X1, CLEAR_Y1 = 48, 115
CLEAR_X2, CLEAR_Y2 = 350, 215


def find_font():
    """사용 가능한 폰트 찾기"""
    for font_path in FONT_PATHS:
        if os.path.exists(font_path):
            return font_path
    raise FileNotFoundError("사용 가능한 한글 폰트를 찾을 수 없습니다.")


def draw_rounded_rectangle(draw, coords, radius, fill=None, outline=None, width=1):
    """라운드 사각형 그리기"""
    x1, y1, x2, y2 = coords

    # 배경 채우기
    if fill:
        draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
        draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)
        draw.pieslice([x1, y1, x1 + 2*radius, y1 + 2*radius], 180, 270, fill=fill)
        draw.pieslice([x2 - 2*radius, y1, x2, y1 + 2*radius], 270, 360, fill=fill)
        draw.pieslice([x1, y2 - 2*radius, x1 + 2*radius, y2], 90, 180, fill=fill)
        draw.pieslice([x2 - 2*radius, y2 - 2*radius, x2, y2], 0, 90, fill=fill)

    # 테두리 그리기
    if outline:
        draw.arc([x1, y1, x1 + 2*radius, y1 + 2*radius], 180, 270, fill=outline, width=width)
        draw.arc([x2 - 2*radius, y1, x2, y1 + 2*radius], 270, 360, fill=outline, width=width)
        draw.arc([x1, y2 - 2*radius, x1 + 2*radius, y2], 90, 180, fill=outline, width=width)
        draw.arc([x2 - 2*radius, y2 - 2*radius, x2, y2], 0, 90, fill=outline, width=width)
        draw.line([x1 + radius, y1, x2 - radius, y1], fill=outline, width=width)
        draw.line([x1 + radius, y2, x2 - radius, y2], fill=outline, width=width)
        draw.line([x1, y1 + radius, x1, y2 - radius], fill=outline, width=width)
        draw.line([x2, y1 + radius, x2, y2 - radius], fill=outline, width=width)


def generate_og_image(region, font, template_img):
    """OG 이미지 생성"""
    # 템플릿 복사
    img = template_img.copy()
    draw = ImageDraw.Draw(img)

    # 텍스트 크기 측정
    text = region["label"]
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # 박스 크기 계산 (텍스트 + 패딩)
    box_width = text_width + TEXT_PADDING * 2
    box_height = text_height + TEXT_PADDING * 2

    # 새 박스 좌표 (원본 박스 위치 기준)
    new_box_x1 = ORIG_BOX_X1
    new_box_y1 = ORIG_BOX_Y1
    new_box_x2 = ORIG_BOX_X1 + box_width
    new_box_y2 = ORIG_BOX_Y1 + box_height

    # 기존 텍스트 영역 덮기 (더 넓은 범위로)
    draw.rectangle([CLEAR_X1, CLEAR_Y1, CLEAR_X2, CLEAR_Y2], fill=BG_COLOR)

    # 새 박스 그리기 (라운드 사각형)
    draw_rounded_rectangle(
        draw,
        [new_box_x1, new_box_y1, new_box_x2, new_box_y2],
        BOX_RADIUS,
        fill=BG_COLOR,
        outline=BORDER_COLOR,
        width=2
    )

    # 텍스트 위치 (박스 내부 중앙)
    text_x = new_box_x1 + TEXT_PADDING
    text_y = new_box_y1 + (box_height - text_height) // 2 - 2

    # 텍스트 그리기
    draw.text((text_x, text_y), text, fill=TEXT_COLOR, font=font)

    # 저장
    output_path = os.path.join(OUTPUT_DIR, f"og-{region['slug']}.png")
    img.save(output_path, "PNG", optimize=True)

    return output_path


def main():
    print("OG 이미지 생성 스크립트 시작...")
    print(f"템플릿: {TEMPLATE_PATH}")
    print(f"출력 폴더: {OUTPUT_DIR}")
    print()

    # 출력 폴더 생성
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 폰트 로드
    font_path = find_font()
    print(f"폰트: {font_path}")
    font = ImageFont.truetype(font_path, FONT_SIZE)

    # 템플릿 이미지 로드 (한 번만)
    template_img = Image.open(TEMPLATE_PATH)
    print(f"템플릿 크기: {template_img.size}")
    print()

    # 52개 지역 이미지 생성
    print(f"{len(regions)}개 지역 OG 이미지 생성 중...")
    print("-" * 50)

    for i, region in enumerate(regions, 1):
        output_path = generate_og_image(region, font, template_img)
        print(f"  [{i:2d}/{len(regions)}] [OK] og-{region['slug']}.png ({region['label']})")

    print("-" * 50)
    print(f"\n완료! {len(regions)}개 OG 이미지가 생성되었습니다.")
    print(f"저장 위치: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
