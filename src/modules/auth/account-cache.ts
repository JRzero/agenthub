import type { QueryClient } from "@tanstack/react-query";

export type AccountCacheClient = Pick<QueryClient, "clear">;

/**
 * Query and mutation results are account-scoped even when their individual
 * query keys only describe workspace or resource identity.
 */
export function clearAccountScopedCache(queryClient: AccountCacheClient): void {
  queryClient.clear();
}
