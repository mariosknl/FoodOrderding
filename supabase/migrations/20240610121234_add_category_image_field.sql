drop policy "Enable read access for all users" on "public"."categories";

alter table "public"."types" drop constraint "types_category_id_fkey";

alter table "public"."categories" add column "category_image" text;

alter table "public"."types" alter column "category_id" set not null;

create policy "Allow authenticated users for all actions"
on "public"."categories"
as permissive
for all
to authenticated
using (true);



