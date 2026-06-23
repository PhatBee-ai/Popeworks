-- 002_longform.sql — productions, shoot days (series & film support)
-- A "job" becomes a production with a type and persistent tokens.
-- A production has many shoot days; each day holds its own scene list.
-- A commercial is just a production with a single day (backfilled below).

-- Production type
alter table jobs add column if not exists type text not null default 'commercial'
  check (type in ('commercial', 'film', 'series'));

-- Production-level shoot_date is now optional; days carry their own dates.
alter table jobs alter column shoot_date drop not null;

-- Shoot days
create table if not exists shoot_days (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  shoot_date date,
  label text not null default '',
  location text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table shoot_days enable row level security;
create policy "shoot_days_select" on shoot_days for select using (true);
create policy "shoot_days_insert" on shoot_days for insert with check (true);
create policy "shoot_days_update" on shoot_days for update using (true);
create policy "shoot_days_delete" on shoot_days for delete using (true);

alter publication supabase_realtime add table shoot_days;

-- Scenes now belong to a shoot day
alter table scenes add column if not exists shoot_day_id uuid references shoot_days(id) on delete cascade;
create policy "scenes_delete" on scenes for delete using (true);

-- Backfill: one day per existing job, attach its scenes
insert into shoot_days (job_id, shoot_date, label, location, sort_order)
  select id, shoot_date, 'Day 1', location, 0 from jobs
  where not exists (select 1 from shoot_days d where d.job_id = jobs.id);

update scenes s set shoot_day_id = d.id
  from shoot_days d
  where d.job_id = s.job_id and s.shoot_day_id is null;
