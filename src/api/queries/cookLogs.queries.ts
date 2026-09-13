import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants/caching.constants";

import { getCookLogs } from "../services/cookLogs.service";

const COOK_LOGS_QUERY_KEY = "cook-logs";

export function useCookLogsQuery() {
  return useQuery({ queryKey: [COOK_LOGS_QUERY_KEY], staleTime: STALE_TIME, queryFn: getCookLogs });
}
