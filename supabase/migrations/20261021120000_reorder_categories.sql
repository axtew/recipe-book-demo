-- Порядок категорий: одна функция вместо построчных запросов с клиента.
--
-- Пишет только sort_order, поэтому перестановка не может затереть имя, которое
-- в это же время переименовали отдельным запросом. Весь список — один
-- оператор, а значит одна транзакция: порядок не бывает переставлен наполовину.

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
