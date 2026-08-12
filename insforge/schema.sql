create extension if not exists pgcrypto;

create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  guardian_one text not null,
  guardian_two text,
  created_at timestamptz not null default now()
);

create table if not exists festival_functions (
  id uuid primary key default gen_random_uuid(),
  number smallint unique not null check (number between 1 and 3),
  name text not null,
  starts_at timestamptz not null,
  family_ticket_limit smallint not null check (family_ticket_limit in (4,6,8))
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  auth_user_id text unique,
  family_id uuid not null references families(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  level smallint not null check (level between 1 and 4),
  function_number smallint not null check (function_number between 1 and 3),
  created_at timestamptz not null default now()
);

create table if not exists booking_windows (
  id uuid primary key default gen_random_uuid(),
  opens_at timestamptz not null,
  closes_at timestamptz not null,
  is_active boolean not null default true,
  check (closes_at > opens_at)
);

create table if not exists seats (
  id uuid primary key default gen_random_uuid(),
  function_id uuid not null references festival_functions(id) on delete cascade,
  seat_number integer not null check (seat_number between 1 and 180),
  row_label text not null,
  zone text not null check (zone in ('Oro','Plata','Bronce')),
  price_mxn integer not null check (price_mxn in (100,140,180)),
  unique(function_id, seat_number)
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  folio text unique not null,
  student_id uuid not null references students(id),
  function_id uuid not null references festival_functions(id),
  status text not null check (status in ('held','paid','expired','cancelled')),
  payment_provider text not null default 'demo',
  payment_reference text,
  total_mxn integer not null default 0,
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists order_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  seat_id uuid not null references seats(id),
  price_mxn integer not null,
  created_at timestamptz not null default now(),
  unique(order_id, seat_id)
);

create unique index if not exists active_seat_assignment on order_tickets(seat_id);

insert into festival_functions (number, name, starts_at, family_ticket_limit)
values
  (1, 'Función 1 - Descubre', '2026-10-24T10:00:00-06:00', 8),
  (2, 'Función 2 - Imagina', '2026-10-24T13:30:00-06:00', 6),
  (3, 'Función 3 - Crea', '2026-10-24T17:00:00-06:00', 4)
on conflict (number) do update set name = excluded.name, starts_at = excluded.starts_at, family_ticket_limit = excluded.family_ticket_limit;

insert into booking_windows (opens_at, closes_at, is_active)
select '2026-08-01T09:00:00-06:00', '2026-10-20T21:00:00-06:00', true
where not exists (select 1 from booking_windows);

insert into seats (function_id, seat_number, row_label, zone, price_mxn)
select f.id, n, chr(64 + ceil(n::numeric / 12)::integer),
  case when n <= 60 then 'Oro' when n <= 120 then 'Plata' else 'Bronce' end,
  case when n <= 60 then 180 when n <= 120 then 140 else 100 end
from festival_functions f cross join generate_series(1,180) n
on conflict (function_id, seat_number) do nothing;

with family_seed(code, guardian_one, guardian_two, members) as (
  values
  ('FAM-001','Mariana Torres','Carlos Torres',4),('FAM-002','Daniela Ríos','Sergio Ríos',4),
  ('FAM-003','Andrea Vega','Luis Vega',4),('FAM-004','Paola Méndez','Jorge Méndez',4),
  ('FAM-005','Laura Castillo','Iván Castillo',4),('FAM-006','Elena Cruz','Manuel Cruz',3),
  ('FAM-007','Patricia Luna','Héctor Luna',3),('FAM-008','Sofía Ramos','Marco Ramos',3),
  ('FAM-009','Karla Flores','Diego Flores',3),('FAM-010','Cecilia Ortiz','Raúl Ortiz',3),
  ('FAM-011','Natalia Salas','Eduardo Salas',3),('FAM-012','Verónica Peña','Ricardo Peña',3),
  ('FAM-013','Mónica Silva','Tomás Silva',3),('FAM-014','Beatriz Mora','Gabriel Mora',3),
  ('FAM-015','Adriana Gil','Roberto Gil',3),('FAM-016','Claudia León','Pablo León',2),
  ('FAM-017','Irene Navarro','Ángel Navarro',2),('FAM-018','Rebeca Fuentes','Óscar Fuentes',2),
  ('FAM-019','Lucía Herrera','César Herrera',2),('FAM-020','Teresa Campos','Hugo Campos',2)
), inserted_families as (
  insert into families (code, guardian_one, guardian_two)
  select code, guardian_one, guardian_two from family_seed
  on conflict (code) do update set guardian_one = excluded.guardian_one, guardian_two = excluded.guardian_two
  returning id, code
)
insert into students (family_id, email, full_name, level, function_number)
select f.id,
  lower(replace(f.code,'-','')) || '-' || member_no || '@reservadesk.demo',
  'Alumno ' || right(f.code,3) || '-' || member_no,
  ((substring(seed.code from 5)::integer + member_no - 2) % 4) + 1,
  case when ((substring(seed.code from 5)::integer + member_no - 2) % 4) + 1 in (1,2) then 1 when ((substring(seed.code from 5)::integer + member_no - 2) % 4) + 1 = 3 then 2 else 3 end
from family_seed seed
join families f on f.code = seed.code
cross join lateral generate_series(1, seed.members) member_no
on conflict (email) do update set full_name = excluded.full_name, level = excluded.level, function_number = excluded.function_number;
