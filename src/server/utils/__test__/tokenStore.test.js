import { describe, it, expect } from "@jest/globals";
import { storeToken, isTokenLoggedOut } from "../tokenStore";

describe("storeToken", () => {
  it("should store token", () => {
    storeToken("token");
    expect(isTokenLoggedOut("token")).toBe(true);
  });

  it("should store only 50 tokens", () => {
    for (let i = 0; i < 60; i++) {
      storeToken(`token${i}`);
    }
    expect(isTokenLoggedOut("token 0")).toBe(false);
  });
});
