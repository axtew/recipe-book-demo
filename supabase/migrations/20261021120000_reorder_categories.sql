-- Category order: one function instead of per-row queries from the client.
--
-- It writes only sort_order, so a reorder cannot overwrite a name that was
-- renamed by a separate request at the same time. The whole list is a single
-- statement, hence one transaction: the order is never left half-reordered.

create or replace function public.reorder_categories(p_kind text, p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_kind = 'product' then
    update public.product_categories c
    set sort_order = o.ord * 10
    from unnest(p_ids) with ordinality as o(id, ord)
    where c.id = o.id;
  elsif p_kind = 'dish' then
    update public.dish_categories c
    set sort_order = o.ord * 10
    from unnest(p_ids) with ordinality as o(id, ord)
    where c.id = o.id;
  else
    raise exception 'unknown_category_kind';
  end if;
end;
$$;

revoke execute on function public.reorder_categories(text, uuid[]) from public, anon;
grant execute on function public.reorder_categories(text, uuid[]) to authenticated;
