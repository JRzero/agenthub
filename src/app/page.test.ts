import { describe, expect, it, vi } from "vitest";

const { redirectMock } = vi.hoisted(() => ({ redirectMock: vi.fn() }));

vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import HomePage from "./page";

describe("root route", () => {
  it("redirects to the workbench", () => {
    HomePage();
    expect(redirectMock).toHaveBeenCalledWith("/workbench");
  });
});
