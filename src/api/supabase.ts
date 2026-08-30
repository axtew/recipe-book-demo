import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";
import { env } from "@/utils/env";

export const supabase = createClient<Database>(env.supabaseUrl, env.supabasePublishableKey);
