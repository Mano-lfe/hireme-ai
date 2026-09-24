-- HireMe AI — run this in Supabase SQL Editor after creating a project.
-- Analyses contain only the result and optional source file name, never the original CV PDF.

create table if not exists public.analyses (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  target_role text not null,
  compatibility_score smallint not null check (compatibility_score between 0 and 100),
  source_file_name text,
  result jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.analyses enable row level security;

create policy "Users can read their own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can create their own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own analyses"
  on public.analyses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);

-- Optional storage bucket. Keep this private and only use it if you add an explicit
-- separate consent flow for CV uploads. The app does not upload PDF files by default.
insert into storage.buckets (id, name, public)
values ('cv-files', 'cv-files', false)
on conflict (id) do nothing;
