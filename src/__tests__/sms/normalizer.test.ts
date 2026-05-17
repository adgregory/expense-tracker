import { describe, it, expect } from "vitest";
import { normalizeMerchant } from "@/lib/sms/normalizer";

describe("normalizeMerchant", () => {
  it("uppercases input", () => { expect(normalizeMerchant("uber rides")).toBe("UBER RIDES"); });
  it("strips DLO* prefix", () => { expect(normalizeMerchant("DLO*Didi")).toBe("DIDI"); });
  it("strips DL* prefix", () => { expect(normalizeMerchant("DL*DIDI RIDES CO")).toBe("DIDI RIDES CO"); });
  it("strips GOOGLE * prefix", () => { expect(normalizeMerchant("GOOGLE *Workspace_luma")).toBe("WORKSPACE"); });
  it("strips *suffix patterns", () => { expect(normalizeMerchant("RAPPI COLOMBIA*DL")).toBe("RAPPI COLOMBIA"); });
  it("strips COLOMBI suffix", () => { expect(normalizeMerchant("LATAM AIRLINES COLOMBI")).toBe("LATAM AIRLINES"); });
  it("strips GROUP S suffix", () => { expect(normalizeMerchant("LATAM AIRLINES GROUP S")).toBe("LATAM AIRLINES"); });
  it("strips _suffix patterns", () => { expect(normalizeMerchant("Workspace_luma")).toBe("WORKSPACE"); });
  it("strips trailing dot and whitespace", () => { expect(normalizeMerchant("DELTA .")).toBe("DELTA"); });
  it("handles Amazon Prime", () => { expect(normalizeMerchant("Amazon Prime")).toBe("AMAZON PRIME"); });
  it("handles MIRADOR GASTRO BAR", () => { expect(normalizeMerchant("MIRADOR GASTRO BAR")).toBe("MIRADOR GASTRO BAR"); });
  it("handles AIRBNB * HMRW5ES99W", () => { expect(normalizeMerchant("AIRBNB * HMRW5ES99W")).toBe("AIRBNB"); });
});
