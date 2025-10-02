-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  plan text default 'free' check (plan in ('free', 'pro', 'business')),
  storage_used bigint default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  published boolean default false,
  published_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Pages
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  slug text not null,
  is_home boolean default false,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(project_id, slug)
);

-- Elements (sections, containers, and atomic elements)
create table public.elements (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade not null,
  parent_id uuid references public.elements(id) on delete cascade,
  type text not null,
  content jsonb default '{}'::jsonb,
  styles jsonb default '{}'::jsonb,
  responsive jsonb default '{}'::jsonb,
  order_index int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Navigation Components
create table public.navigation_components (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  type text not null check (type in ('navbar', 'sidebar')),
  logo_url text,
  logo_position text,
  background_color text,
  text_color text,
  responsive_breakpoints jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Navigation Links
create table public.navigation_links (
  id uuid primary key default gen_random_uuid(),
  navigation_id uuid references public.navigation_components(id) on delete cascade not null,
  label text not null,
  url text,
  icon text,
  order_index int default 0,
  is_dropdown boolean default false,
  parent_id uuid references public.navigation_links(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Form Submissions
create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  form_name text not null,
  data jsonb not null,
  submitted_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.pages enable row level security;
alter table public.elements enable row level security;
alter table public.navigation_components enable row level security;
alter table public.navigation_links enable row level security;
alter table public.form_submissions enable row level security;

-- RLS Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for projects
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- RLS Policies for pages
create policy "Users can view pages of own projects"
  on public.pages for select
  using (exists (
    select 1 from public.projects
    where projects.id = pages.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can create pages in own projects"
  on public.pages for insert
  with check (exists (
    select 1 from public.projects
    where projects.id = pages.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can update pages in own projects"
  on public.pages for update
  using (exists (
    select 1 from public.projects
    where projects.id = pages.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can delete pages in own projects"
  on public.pages for delete
  using (exists (
    select 1 from public.projects
    where projects.id = pages.project_id
    and projects.user_id = auth.uid()
  ));

-- RLS Policies for elements
create policy "Users can view elements of own pages"
  on public.elements for select
  using (exists (
    select 1 from public.pages
    join public.projects on projects.id = pages.project_id
    where pages.id = elements.page_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can create elements in own pages"
  on public.elements for insert
  with check (exists (
    select 1 from public.pages
    join public.projects on projects.id = pages.project_id
    where pages.id = elements.page_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can update elements in own pages"
  on public.elements for update
  using (exists (
    select 1 from public.pages
    join public.projects on projects.id = pages.project_id
    where pages.id = elements.page_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can delete elements in own pages"
  on public.elements for delete
  using (exists (
    select 1 from public.pages
    join public.projects on projects.id = pages.project_id
    where pages.id = elements.page_id
    and projects.user_id = auth.uid()
  ));

-- RLS Policies for navigation components
create policy "Users can view navigation of own projects"
  on public.navigation_components for select
  using (exists (
    select 1 from public.projects
    where projects.id = navigation_components.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can create navigation in own projects"
  on public.navigation_components for insert
  with check (exists (
    select 1 from public.projects
    where projects.id = navigation_components.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can update navigation in own projects"
  on public.navigation_components for update
  using (exists (
    select 1 from public.projects
    where projects.id = navigation_components.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can delete navigation in own projects"
  on public.navigation_components for delete
  using (exists (
    select 1 from public.projects
    where projects.id = navigation_components.project_id
    and projects.user_id = auth.uid()
  ));

-- RLS Policies for navigation links
create policy "Users can view navigation links of own projects"
  on public.navigation_links for select
  using (exists (
    select 1 from public.navigation_components
    join public.projects on projects.id = navigation_components.project_id
    where navigation_components.id = navigation_links.navigation_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can create navigation links in own projects"
  on public.navigation_links for insert
  with check (exists (
    select 1 from public.navigation_components
    join public.projects on projects.id = navigation_components.project_id
    where navigation_components.id = navigation_links.navigation_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can update navigation links in own projects"
  on public.navigation_links for update
  using (exists (
    select 1 from public.navigation_components
    join public.projects on projects.id = navigation_components.project_id
    where navigation_components.id = navigation_links.navigation_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can delete navigation links in own projects"
  on public.navigation_links for delete
  using (exists (
    select 1 from public.navigation_components
    join public.projects on projects.id = navigation_components.project_id
    where navigation_components.id = navigation_links.navigation_id
    and projects.user_id = auth.uid()
  ));

-- RLS Policies for form submissions
create policy "Users can view form submissions of own projects"
  on public.form_submissions for select
  using (exists (
    select 1 from public.projects
    where projects.id = form_submissions.project_id
    and projects.user_id = auth.uid()
  ));

create policy "Users can create form submissions in own projects"
  on public.form_submissions for insert
  with check (exists (
    select 1 from public.projects
    where projects.id = form_submissions.project_id
    and projects.user_id = auth.uid()
  ));

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at_column();

create trigger update_pages_updated_at
  before update on public.pages
  for each row execute function public.update_updated_at_column();

create trigger update_elements_updated_at
  before update on public.elements
  for each row execute function public.update_updated_at_column();

create trigger update_navigation_components_updated_at
  before update on public.navigation_components
  for each row execute function public.update_updated_at_column();