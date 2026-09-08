import type { QueryData } from "@supabase/supabase-js";

import { nutritionSnapshotSchema } from "@/domain/schemas";
import type { ICookLog } from "@/types/cookLogs.types";

import { supabase } from "../supabase";

function buildCookLogsQuery() {
  return supabase
    .from("cook_logs")
    .select("*")
    .order("cooked_at", { ascending: false })
    .order("created_at", { ascending: false });
}

export async function getCookLogs(): Promise<ICookLog[]> {
  const { data, error } = await buildCookLogsQuery();

  if (error) throw new Error("Произошла ошибка при запросе журнала готовки.", { cause: error });

  return data.map(mapCookLog);
}

type TDBCookLog = QueryData<ReturnType<typeof buildCookLogsQuery>>[number];

function mapCookLog(log: TDBCookLog): ICookLog {
  const { success, data, error } = nutritionSnapshotSchema.safeParse(log.snapshot);

  if (!success) console.error(`Не удалось распарсить snapshot из журнала ${log.id}`, error);

  return {
    actualYieldGrams: log.actual_yield_grams,
    containers: log.containers,
    cookedAt: log.cooked_at,
    finishedAt: log.finished_at,
    id: log.id,
    multiplier: log.multiplier,
    note: log.note,
    rating: log.rating,
    recipeId: log.recipe_id,
    snapshot: success ? data : null,
  };
}
