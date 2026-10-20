import { useMutation, useQueryClient } from "@tanstack/react-query";

import { COOK_LOGS_QUERY_KEY } from "../queries/cookLogs.queries";
import { createCookLog, finishCookLog } from "../services/cookLogs.service";

export function useCreateCookLogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCookLog,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [COOK_LOGS_QUERY_KEY] });
    },
  });
}

export function useFinishCookLogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finishCookLog,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [COOK_LOGS_QUERY_KEY] });
    },
  });
}
