-- ProfIA initial schema. Every private row is protected with RLS and scoped to auth.uid().
create extension if not exists "pgcrypto";

create type public.exercise_status as enum ('uploaded', 'ocr_pending', 'ocr_ready', 'analyzing', 'completed', 'failed');
create type public.correction_verdict as enum ('correct', 'partially_correct', 'incorrect');
create type public.explanation_level as enum ('simple', 'normal', 'deep');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text check (char_length(nickname) between 1 and 60),
  age smallint check (age between 5 and 120),
  school_class text,
  favorite_subjects text[] not null default '{}',
  difficult_subjects text[] not null default '{}',
  explanation_level public.explanation_level not null default 'normal',
  study_goals text,
  primary_language text not null default 'it',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

insert into public.subjects (slug, name) values
('matematica','Matematica'), ('italiano','Italiano'), ('grammatica','Grammatica'),
('storia','Storia'), ('geografia','Geografia'), ('scienze','Scienze'),
('fisica','Fisica'), ('chimica','Chimica'), ('inglese','Inglese'),
('lingue','Altre lingue'), ('informatica','Informatica'), ('altro','Altro');

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id),
  title text not null default 'Nuovo esercizio',
  topic text,
  school_level text not null,
  correction_mode text not null default 'complete' check (correction_mode in ('hint','guided','complete')),
  status public.exercise_status not null default 'uploaded',
  is_completed boolean not null default false,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exercise_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp','image/heic','application/pdf')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 12582912),
  privacy_redacted boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.ocr_texts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null unique references public.exercises(id) on delete cascade,
  assignment_text text,
  student_answer text,
  intermediate_steps jsonb not null default '[]'::jsonb,
  annotations text,
  unreadable_regions jsonb not null default '[]'::jsonb,
  confidence numeric(5,2) check (confidence between 0 and 100),
  user_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.corrections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null unique references public.exercises(id) on delete cascade,
  verdict public.correction_verdict not null,
  orientation_score smallint check (orientation_score between 0 and 100),
  positives jsonb not null default '[]'::jsonb,
  errors jsonb not null default '[]'::jsonb,
  explanations jsonb not null default '[]'::jsonb,
  hints jsonb not null default '[]'::jsonb,
  correct_method jsonb not null default '[]'::jsonb,
  final_result text,
  review_topics text[] not null default '{}',
  similar_exercise jsonb,
  model_name text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null check (char_length(content) between 1 and 12000),
  created_at timestamptz not null default now()
);

create table public.progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id),
  period_start date not null,
  total_exercises integer not null default 0,
  correct_answers integer not null default 0,
  frequent_errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, subject_id, period_start)
);

create table public.favorite_exercises (
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

create table public.review_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete cascade,
  subject_id uuid references public.subjects(id),
  topic text not null,
  reminder_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index exercises_user_created_idx on public.exercises(user_id, created_at desc);
create index files_exercise_idx on public.exercise_files(exercise_id);
create index messages_exercise_created_idx on public.chat_messages(exercise_id, created_at);
create index review_user_reminder_idx on public.review_topics(user_id, reminder_at) where completed_at is null;

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger exercises_updated before update on public.exercises for each row execute function public.set_updated_at();
create trigger ocr_updated before update on public.ocr_texts for each row execute function public.set_updated_at();
create trigger corrections_updated before update on public.corrections for each row execute function public.set_updated_at();
create trigger review_updated before update on public.review_topics for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles (id, nickname) values (new.id, coalesce(new.raw_user_meta_data ->> 'nickname', split_part(coalesce(new.email, 'Studente'), '@', 1))); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_files enable row level security;
alter table public.ocr_texts enable row level security;
alter table public.corrections enable row level security;
alter table public.chat_messages enable row level security;
alter table public.progress_snapshots enable row level security;
alter table public.favorite_exercises enable row level security;
alter table public.review_topics enable row level security;

create policy "profiles_own" on public.profiles for all using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "exercises_own" on public.exercises for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "files_own" on public.exercise_files for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "ocr_own" on public.ocr_texts for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "corrections_own" on public.corrections for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "messages_own" on public.chat_messages for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "progress_own" on public.progress_snapshots for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "favorites_own" on public.favorite_exercises for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "reviews_own" on public.review_topics for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Subjects are public reference data, not student data.
alter table public.subjects enable row level security;
create policy "subjects_read" on public.subjects for select using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('exercise-files', 'exercise-files', false, 12582912, array['image/jpeg','image/png','image/webp','image/heic','application/pdf'])
on conflict (id) do nothing;

-- Paths must start with the authenticated user id: <uid>/<exercise-id>/<filename>.
create policy "storage_insert_own" on storage.objects for insert to authenticated
with check (bucket_id = 'exercise-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "storage_select_own" on storage.objects for select to authenticated
using (bucket_id = 'exercise-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "storage_update_own" on storage.objects for update to authenticated
using (bucket_id = 'exercise-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "storage_delete_own" on storage.objects for delete to authenticated
using (bucket_id = 'exercise-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
