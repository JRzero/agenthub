import React from "react";
import { describe, expect, it } from "vitest";
import { PublicLandingPage } from "@/modules/landing/public-landing-page";
import HomePage from "./page";

Object.assign(globalThis, { React });

describe("root route", () => {
  it("renders the public AgentHub landing page instead of redirecting", () => {
    const page = HomePage();
    expect(page.type).toBe(PublicLandingPage);
  });
});
