-- =========================================================
--  MiniHesap — Supabase sipariş tablosu
--
--  Nasıl çalıştırılır:
--    Supabase paneli > sol menü > SQL Editor > New query
--    Bu dosyanın tamamını yapıştırıp "Run" deyin.
--
--  Not: Sütun adları çift tırnaklıdır. Postgres tırnaksız adları
--  küçük harfe çevirir; uygulama camelCase gönderdiği için
--  tırnak şart.
-- =========================================================

create table if not exists public.orders (
    "id"                text        primary key,
    "productSlug"       text        not null,
    "productTitle"      text        not null,
    "amountKurus"       integer     not null check ("amountKurus" >= 0),
    "currency"          text        not null default 'TRY',
    "email"             text        not null,
    "fullName"          text        not null,
    "phone"             text,
    "status"            text        not null default 'bekliyor'
                                    check ("status" in ('bekliyor','odendi','basarisiz','iade')),
    "provider"          text        not null,
    "providerRef"       text,
    "createdAt"         timestamptz not null default now(),
    "paidAt"            timestamptz,
    "downloadCount"     integer     not null default 0,
    "firstDownloadedAt" timestamptz,
    "lastDownloadedAt"  timestamptz,
    "downloadExpiresAt" timestamptz,
    "ip"                text
);

alter table public.orders add column if not exists "firstDownloadedAt" timestamptz;
alter table public.orders add column if not exists "lastDownloadedAt" timestamptz;

-- Sipariş listeleme ve arama için indeksler
create index if not exists orders_created_idx
    on public.orders ("createdAt" desc);

create index if not exists orders_status_idx
    on public.orders ("status");

create index if not exists orders_email_idx
    on public.orders ("email");

create index if not exists orders_provider_ref_idx
    on public.orders ("providerRef");

-- =========================================================
--  GÜVENLİK
--
--  RLS açılır ve HİÇBİR politika tanımlanmaz.
--  Böylece anon ve authenticated anahtarlarla tabloya
--  erişilemez; yalnızca sunucudaki service_role anahtarı
--  (RLS'i baypas eder) okuyup yazabilir.
--
--  Bu bilinçli bir tercihtir: sipariş verisi tarayıcıdan
--  asla okunmamalıdır.
-- =========================================================

alter table public.orders enable row level security;

-- Anon rolünün yanlışlıkla erişmesini ayrıca engelle
revoke all on public.orders from anon;
revoke all on public.orders from authenticated;

-- =========================================================
--  PROGRAM TALEPLERİ
-- =========================================================

create table if not exists public.program_requests (
    "id"            text primary key,
    "name"          text not null,
    "email"         text not null,
    "description"   text not null,
    "category"      text not null,
    "aiSummary"     text not null,
    "aiQuestions"   jsonb not null default '[]'::jsonb,
    "status"        text not null default 'yeni'
                    check ("status" in ('yeni','inceleniyor','tamamlandi')),
    "createdAt"     timestamptz not null default now(),
    "ip"            text
);

create index if not exists program_requests_created_idx
    on public.program_requests ("createdAt" desc);

create index if not exists program_requests_status_idx
    on public.program_requests ("status");

alter table public.program_requests enable row level security;
revoke all on public.program_requests from anon;
revoke all on public.program_requests from authenticated;

-- =========================================================
--  DOĞRULAMA
--  Aşağıdaki sorgu tablo kurulduysa satır döndürür.
-- =========================================================

select
    column_name  as "sutun",
    data_type    as "tur",
    is_nullable  as "bos_olabilir"
from information_schema.columns
where table_schema = 'public' and table_name = 'orders'
order by ordinal_position;
