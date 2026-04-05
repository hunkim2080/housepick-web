-- ============================================================
-- 하우스픽 현장 등록 시스템 DB 스키마 v1
-- Supabase SQL Editor에서 실행
-- ============================================================

-- 1. job_cases: 현장(시공 건) 단위 테이블
-- ============================================================
create table job_cases (
  id bigint generated always as identity primary key,

  -- 아파트 정보 (apartments.json 매핑)
  apartment_slug text not null,
  apartment_name text not null,
  district_name text not null,
  region_slug text not null,

  -- 시공 정보
  work_date date,
  space_types text,           -- 콤마 구분: bathroom,entrance
  issue_types text,           -- 콤마 구분: mold,discoloration
  material_type text default 'kerapoxy',
  memo text,                  -- 현장 메모

  -- 담당자
  created_by text not null,   -- 직원 이름 (추후 auth UUID로 전환)

  -- 상태 관리
  status text not null default 'draft'
    check (status in ('draft', 'review_ready', 'approved', 'published', 'archived', 'rejected')),

  -- 대표 이미지
  representative_image_id bigint,  -- job_case_images.id 참조

  -- SEO 원고 (발행 시 생성)
  seo_title text,
  seo_content text,
  case_slug text unique,      -- URL용 고유 슬러그

  -- 타임스탬프
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 인덱스
create index idx_job_cases_status on job_cases(status);
create index idx_job_cases_apartment on job_cases(apartment_slug);
create index idx_job_cases_work_date on job_cases(work_date desc);
create index idx_job_cases_created_by on job_cases(created_by);

-- ============================================================
-- 2. job_case_images: 이미지 단위 테이블
-- ============================================================
create table job_case_images (
  id bigint generated always as identity primary key,
  case_id bigint not null references job_cases(id) on delete cascade,

  -- 파일 저장 경로
  storage_path_original text not null,   -- originals/ 버킷 경로
  storage_path_public text,              -- public-assets/ 경로 (승인 후 생성)
  thumbnail_path text,                   -- 썸네일 경로

  -- 파일 메타
  file_name_original text not null,      -- 원본 파일명
  file_name_slugged text,                -- SEO용 파일명 (apt-bathroom-before-2026-04-05-a12f.webp)
  mime_type text not null,
  width int,
  height int,
  file_size int,                         -- bytes

  -- EXIF 데이터 (민감 정보 제외, 내부용)
  timestamp_taken timestamptz,           -- 촬영 시각 (EXIF에서 추출, nullable)

  -- 분류: 자동 제안 vs 확정
  auto_step text                         -- EXIF 시간 기반 제안: before, during, after
    check (auto_step in ('before', 'during', 'after', null)),
  confirmed_step text                    -- 직원 확정: before, during, after
    check (confirmed_step in ('before', 'during', 'after', null)),
  confirmed_location text,              -- 직원 확정 장소: bathroom, entrance, veranda 등

  -- 관리 플래그
  is_excluded boolean not null default false,    -- 발행 대상에서 제외
  is_representative boolean not null default false,  -- 대표 이미지
  review_status text not null default 'pending'  -- pending, reviewed
    check (review_status in ('pending', 'reviewed')),

  -- SEO
  alt_text text,                         -- 이미지 alt (데이터 기반 자동 생성)
  caption text,                          -- 이미지 설명문

  -- 정렬
  sort_order int not null default 0,

  -- 타임스탬프
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 인덱스
create index idx_job_case_images_case on job_case_images(case_id);
create index idx_job_case_images_step on job_case_images(confirmed_step);
create index idx_job_case_images_location on job_case_images(confirmed_location);

-- ============================================================
-- 3. job_case_events: 현장 작업 흐름 기록
-- ============================================================
create table job_case_events (
  id bigint generated always as identity primary key,
  case_id bigint not null references job_cases(id) on delete cascade,

  event_type text not null
    check (event_type in ('before', 'during', 'after', 'inspection', 'cleanup', 'finish')),
  event_time timestamptz,               -- 실제 작업 시각
  note text,                            -- 이벤트 메모

  created_at timestamptz not null default now()
);

create index idx_job_case_events_case on job_case_events(case_id);

-- ============================================================
-- 4. Storage 버킷
-- ============================================================

-- 비공개 원본 버킷 (직원/관리자만 접근)
insert into storage.buckets (id, name, public, file_size_limit)
values ('originals', 'originals', false, 20971520)  -- 20MB 제한
on conflict (id) do nothing;

-- 공개 자산 버킷 (승인된 이미지만)
insert into storage.buckets (id, name, public, file_size_limit)
values ('public-assets', 'public-assets', true, 5242880)  -- 5MB 제한 (최적화 후)
on conflict (id) do nothing;

-- ============================================================
-- 5. Storage RLS 정책
-- ============================================================

-- originals: 업로드는 서비스키/인증 사용자만
create policy "originals_insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'originals');

create policy "originals_select" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'originals');

-- public-assets: 누구나 읽기 가능, 쓰기는 서비스키만
create policy "public_assets_read" on storage.objects
  for select
  using (bucket_id = 'public-assets');

create policy "public_assets_insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'public-assets');

-- ============================================================
-- 6. DB RLS (기본 — 추후 Auth 연동 시 강화)
-- ============================================================

-- 현재는 publishable key로 접근하므로 기본 open
-- Auth 도입 시 created_by = auth.uid() 등으로 제한
alter table job_cases disable row level security;
alter table job_case_images disable row level security;
alter table job_case_events disable row level security;

-- ============================================================
-- 7. 자동 updated_at 트리거
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger job_cases_updated_at
  before update on job_cases
  for each row execute function update_updated_at();

create trigger job_case_images_updated_at
  before update on job_case_images
  for each row execute function update_updated_at();
