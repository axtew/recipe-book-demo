create extension if not exists "pgcrypto";

create table product_categories (
  id          uuid primary key default gen_random_uuid(), 
  name        text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table dish_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  category_id       uuid not null references product_categories(id) on delete restrict,
  active_variant_id uuid,
  note              text,
  archived_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  name           text,
  kcal_100       numeric(7,2) check (kcal_100    >= 0),
  protein_100    numeric(6,2) check (protein_100 >= 0),
  fat_100        numeric(6,2) check (fat_100     >= 0),
  carbs_100      numeric(6,2) check (carbs_100   >= 0),
  is_approximate boolean not null default false,
  source         text not null default 'manual'
                 check (source in ('seed', 'manual', 'label', 'llm')),
  note           text,
  archived_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint uq_variant_product unique (id, product_id)
);

alter table products
  add constraint fk_active_variant
  foreign key (active_variant_id, id)
  references product_variants(id, product_id)
  on delete restrict
  deferrable initially deferred;

create table recipes (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  dish_category_id    uuid not null references dish_categories(id) on delete restrict,
  servings_base       integer not null default 1 check (servings_base > 0),
  yield_grams         numeric(8,1) check (yield_grams > 0),
  cook_time_min       integer check (cook_time_min > 0),
  photo_path          text,
  notes               text,
  video_urls          text[] not null default '{}',
  freezable           boolean not null default false,
  freezer_days        integer check (freezer_days >= 0),
  fridge_days         integer check (fridge_days  >= 0),
  kcal_100_override    numeric(7,2) check (kcal_100_override    >= 0),
  protein_100_override numeric(6,2) check (protein_100_override >= 0),
  fat_100_override     numeric(6,2) check (fat_100_override     >= 0),
  carbs_100_override   numeric(6,2) check (carbs_100_override   >= 0),
  archived_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table recipe_steps (
  id         uuid primary key default gen_random_uuid(),
  recipe_id  uuid not null references recipes(id) on delete cascade,
  sort_order integer not null,
  text       text not null
);

create table recipe_ingredients (
  id                uuid primary key default gen_random_uuid(),
  recipe_id         uuid not null references recipes(id) on delete cascade,
  product_id        uuid not null references products(id) on delete restrict,
  pinned_variant_id uuid references product_variants(id) on delete restrict,
  amount_grams      numeric(8,1) not null check (amount_grams > 0),
  is_optional       boolean not null default false,
  note              text,
  sort_order        integer not null
);

create table cook_logs (
  id                 uuid primary key default gen_random_uuid(),
  recipe_id          uuid not null references recipes(id) on delete cascade,
  cooked_at          date not null default current_date,
  multiplier         numeric(4,2) not null default 1 check (multiplier > 0),
  actual_yield_grams numeric(8,1) check (actual_yield_grams > 0),
  containers         integer check (containers > 0),
  finished_at        date,
  rating             integer check (rating between 1 and 5),
  note               text,
  snapshot           jsonb not null,
  created_at         timestamptz not null default now(),
  constraint chk_finished_after_cooked
    check (finished_at is null or finished_at >= cooked_at)
);

create index idx_products_category   on products(category_id);
create index idx_variants_product    on product_variants(product_id);
create index idx_ingredients_recipe  on recipe_ingredients(recipe_id);
create index idx_ingredients_product on recipe_ingredients(product_id);
create index idx_steps_recipe        on recipe_steps(recipe_id);
create index idx_cook_logs_recipe    on cook_logs(recipe_id, cooked_at desc);

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_products_updated
  before update on products
  for each row execute function touch_updated_at();

create trigger trg_variants_updated
  before update on product_variants
  for each row execute function touch_updated_at();

create trigger trg_recipes_updated
  before update on recipes
  for each row execute function touch_updated_at();

alter table product_categories enable row level security;
alter table dish_categories    enable row level security;
alter table products           enable row level security;
alter table product_variants   enable row level security;
alter table recipes            enable row level security;
alter table recipe_steps       enable row level security;
alter table recipe_ingredients enable row level security;
alter table cook_logs          enable row level security;

create policy "authenticated full access" on products
  for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('recipe-photos', 'recipe-photos', true)
on conflict (id) do nothing;

create policy "authenticated can upload photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'recipe-photos');

create policy "authenticated can update photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'recipe-photos');

create policy "authenticated can delete photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'recipe-photos');
