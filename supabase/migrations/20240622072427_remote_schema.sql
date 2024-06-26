drop policy "Allow authenticated users to SELECT" on "public"."products";

revoke delete on table "public"."products" from "anon";

revoke insert on table "public"."products" from "anon";

revoke references on table "public"."products" from "anon";

revoke select on table "public"."products" from "anon";

revoke trigger on table "public"."products" from "anon";

revoke truncate on table "public"."products" from "anon";

revoke update on table "public"."products" from "anon";

revoke delete on table "public"."products" from "authenticated";

revoke insert on table "public"."products" from "authenticated";

revoke references on table "public"."products" from "authenticated";

revoke select on table "public"."products" from "authenticated";

revoke trigger on table "public"."products" from "authenticated";

revoke truncate on table "public"."products" from "authenticated";

revoke update on table "public"."products" from "authenticated";

revoke delete on table "public"."products" from "service_role";

revoke insert on table "public"."products" from "service_role";

revoke references on table "public"."products" from "service_role";

revoke select on table "public"."products" from "service_role";

revoke trigger on table "public"."products" from "service_role";

revoke truncate on table "public"."products" from "service_role";

revoke update on table "public"."products" from "service_role";

alter table "public"."order_items" drop constraint "public_order_items_product_id_fkey";

alter table "public"."items" drop constraint "items_type_id_fkey";

alter table "public"."products" drop constraint "products_pkey";

drop index if exists "public"."products_pkey";

drop table "public"."products";

alter table "public"."items" alter column "id" set default nextval('types_id_seq'::regclass);

alter table "public"."items" alter column "id" set data type integer using "id"::integer;

alter table "public"."order_items" drop column "size";

alter table "public"."profiles" drop column "stripe_customer_id";

alter table "public"."profiles" drop column "website";

alter table "public"."profiles" add column "address" text;

alter table "public"."profiles" add column "phone" text;

CREATE UNIQUE INDEX categories_id_key ON public.categories USING btree (id);

CREATE UNIQUE INDEX items_id_key ON public.items USING btree (id);

CREATE UNIQUE INDEX types_id_key ON public.types USING btree (id);

alter table "public"."categories" add constraint "categories_id_key" UNIQUE using index "categories_id_key";

alter table "public"."items" add constraint "items_id_key" UNIQUE using index "items_id_key";

alter table "public"."order_items" add constraint "order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES items(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "order_items_product_id_fkey";

alter table "public"."types" add constraint "types_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."types" validate constraint "types_category_id_fkey";

alter table "public"."types" add constraint "types_id_key" UNIQUE using index "types_id_key";

alter table "public"."items" add constraint "items_type_id_fkey" FOREIGN KEY (type_id) REFERENCES types(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."items" validate constraint "items_type_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."categories"
as permissive
for all
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."items"
as permissive
for all
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."types"
as permissive
for all
to authenticated
using (true);



