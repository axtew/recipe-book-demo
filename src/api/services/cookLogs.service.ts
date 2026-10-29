import type { QueryData } from "@supabase/supabase-js";

import { nutritionSnapshotSchema } from "@/domain/schemas";
import type { ICookLog, ICookLogInput } from "@/types/cookLogs.types";

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

  if (error) throw new Error("An error occurred while requesting the cook log.", { cause: error });

  return data.map(mapCookLog);
}

export async function createCookLog({
  recipeId,
  log,
}: {
  recipeId: string;
  log: ICookLogInput;
}): Promise<void> {
  const { error } = await supabase.from("cook_logs").insert({
    recipe_id: recipeId,
    cooked_at: log.cookedAt,
    multiplier: log.multiplier,
    actual_yield_grams: log.actualYieldGrams,
    containers: log.containers,
    finished_at: log.finishedAt,
    rating: log.rating,
    note: log.note,
    // The snapshot interface is not assignable to `Json` (it has no index signature), while
    // the type inferred from the schema is; the snapshot is also validated at the boundary this way.
    snapshot: nutritionSnapshotSchema.parse(log.snapshot),
  });

  if (error) throw new Error("An error occurred while recording a cook.", { cause: error });
}

export async function finishCookLog({
  id,
  finishedAt,
}: {
  id: string;
  finishedAt: string;
}): Promise<void> {
  const { error } = await supabase
    .from("cook_logs")
    .update({ finished_at: finishedAt })
    .eq("id", id);

  if (error) throw new Error("An error occurred while marking as “finished”.", { cause: error });
}

type TDBCookLog = QueryData<ReturnType<typeof buildCookLogsQuery>>[number];

function mapCookLog(log: TDBCookLog): ICookLog {
  const { success, data, error } = nutritionSnapshotSchema.safeParse(log.snapshot);

  if (!success) console.error(`Failed to parse the snapshot from log ${log.id}`, error);

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
