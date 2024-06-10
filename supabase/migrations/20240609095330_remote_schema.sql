create sequence "public"."categories_id_seq";

create sequence "public"."types_id_seq";

create table "public"."categories" (
    "id" integer not null default nextval('categories_id_seq'::regclass),
    "name" text not null
);


alter table "public"."categories" enable row level security;

create table "public"."items" (
    "id" text not null,
    "type_id" integer,
    "name" text not null,
    "price" numeric not null,
    "info" text,
    "img" text
);


alter table "public"."items" enable row level security;

create table "public"."types" (
    "id" integer not null default nextval('types_id_seq'::regclass),
    "category_id" integer,
    "name" text not null
);


alter table "public"."types" enable row level security;

alter sequence "public"."categories_id_seq" owned by "public"."categories"."id";

alter sequence "public"."types_id_seq" owned by "public"."types"."id";

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX items_pkey ON public.items USING btree (id);

CREATE UNIQUE INDEX types_pkey ON public.types USING btree (id);

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."items" add constraint "items_pkey" PRIMARY KEY using index "items_pkey";

alter table "public"."types" add constraint "types_pkey" PRIMARY KEY using index "types_pkey";

alter table "public"."items" add constraint "items_type_id_fkey" FOREIGN KEY (type_id) REFERENCES types(id) not valid;

alter table "public"."items" validate constraint "items_type_id_fkey";

alter table "public"."types" add constraint "types_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."types" validate constraint "types_category_id_fkey";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."items" to "anon";

grant insert on table "public"."items" to "anon";

grant references on table "public"."items" to "anon";

grant select on table "public"."items" to "anon";

grant trigger on table "public"."items" to "anon";

grant truncate on table "public"."items" to "anon";

grant update on table "public"."items" to "anon";

grant delete on table "public"."items" to "authenticated";

grant insert on table "public"."items" to "authenticated";

grant references on table "public"."items" to "authenticated";

grant select on table "public"."items" to "authenticated";

grant trigger on table "public"."items" to "authenticated";

grant truncate on table "public"."items" to "authenticated";

grant update on table "public"."items" to "authenticated";

grant delete on table "public"."items" to "service_role";

grant insert on table "public"."items" to "service_role";

grant references on table "public"."items" to "service_role";

grant select on table "public"."items" to "service_role";

grant trigger on table "public"."items" to "service_role";

grant truncate on table "public"."items" to "service_role";

grant update on table "public"."items" to "service_role";

grant delete on table "public"."types" to "anon";

grant insert on table "public"."types" to "anon";

grant references on table "public"."types" to "anon";

grant select on table "public"."types" to "anon";

grant trigger on table "public"."types" to "anon";

grant truncate on table "public"."types" to "anon";

grant update on table "public"."types" to "anon";

grant delete on table "public"."types" to "authenticated";

grant insert on table "public"."types" to "authenticated";

grant references on table "public"."types" to "authenticated";

grant select on table "public"."types" to "authenticated";

grant trigger on table "public"."types" to "authenticated";

grant truncate on table "public"."types" to "authenticated";

grant update on table "public"."types" to "authenticated";

grant delete on table "public"."types" to "service_role";

grant insert on table "public"."types" to "service_role";

grant references on table "public"."types" to "service_role";

grant select on table "public"."types" to "service_role";

grant trigger on table "public"."types" to "service_role";

grant truncate on table "public"."types" to "service_role";

grant update on table "public"."types" to "service_role";

create policy "Enable read access for all users"
on "public"."categories"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."items"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."types"
as permissive
for select
to public
using (true);



