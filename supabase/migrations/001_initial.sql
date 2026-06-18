create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  shoot_date date not null,
  location text not null,
  units smallint not null default 1 check (units in (1, 2)),
  qtake_url text,
  admin_token uuid not null default gen_random_uuid(),
  op_token uuid not null default gen_random_uuid(),
  client_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table scenes (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  scene_number text not null,
  title text not null,
  location text not null,
  unit text not null default 'a' check (unit in ('a', 'b')),
  status text not null default 'upcoming' check (status in ('upcoming', 'inprogress', 'complete')),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table jobs enable row level security;
alter table scenes enable row level security;

create policy "jobs_select" on jobs for select using (true);
create policy "jobs_insert" on jobs for insert with check (true);

create policy "scenes_select" on scenes for select using (true);
create policy "scenes_insert" on scenes for insert with check (true);
create policy "scenes_update" on scenes for update using (true);

create or replace function update_scene_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger scene_updated
  before update on scenes
  for each row execute function update_scene_timestamp();

alter publication supabase_realtime add table scenes;
