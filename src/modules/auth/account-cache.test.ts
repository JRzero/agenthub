import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { clearAccountScopedCache } from "./account-cache";

describe("account-scoped query cache", () => {
  it("removes data cached by the previous account", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(["agents", "default", false], [
      { id: 909, name: "previous account asset" },
    ]);

    clearAccountScopedCache(queryClient);

    expect(
      queryClient.getQueryData(["agents", "default", false]),
    ).toBeUndefined();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
  });

  it("uses QueryClient.clear so query and mutation state are both discarded", () => {
    const clear = vi.fn();

    clearAccountScopedCache({ clear });

    expect(clear).toHaveBeenCalledOnce();
  });
});
