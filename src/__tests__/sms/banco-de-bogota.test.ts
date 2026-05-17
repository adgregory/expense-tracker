import { describe, it, expect } from "vitest";
import { BancoDeBogotaParser } from "@/lib/sms/banks/banco-de-bogota";

const parser = new BancoDeBogotaParser();

describe("BancoDeBogotaParser", () => {
  it("parses Format A (full details)", () => {
    const sms = "Banco de Bogota: Tu compra por 26,706 fue aprobada con Tarjeta Crédito 4910 el 10/05/26 21:25:35 en UBER RIDES ¿Dudas? Llama a la Servilinea ...";
    const result = parser.parse(sms);
    expect(result).not.toBeNull();
    expect(result!.amount).toBe(26706);
    expect(result!.cardLast4).toBe("4910");
    expect(result!.date).toBe("2026-05-10");
    expect(result!.time).toBe("21:25:35");
    expect(result!.merchant).toBe("UBER RIDES");
  });

  it("parses Format A with larger amount", () => {
    const sms = "Banco de Bogota: Tu compra por 375,852 fue aprobada con Tarjeta Crédito 4910 el 10/05/26 00:41:35 en MIRADOR GASTRO BAR ¿Dudas? Llama a la Servilinea ...";
    const result = parser.parse(sms);
    expect(result!.amount).toBe(375852);
    expect(result!.merchant).toBe("MIRADOR GASTRO BAR");
  });

  it("parses Format B (no date/time)", () => {
    const sms = "Tu transaccion fue aprobada con T. Credito #4910 por $750,960 en LATAM AIRLINES COLOMBI . Si no has sido tu, responde este mensaje con la palabra NO. ...";
    const result = parser.parse(sms);
    expect(result!.amount).toBe(750960);
    expect(result!.cardLast4).toBe("4910");
    expect(result!.merchant).toBe("LATAM AIRLINES COLOMBI");
    expect(result!.date).toBeTruthy();
  });

  it("parses Format B with DELTA", () => {
    const sms = "Tu transaccion fue aprobada con T. Credito #4910 por $249,418 en DELTA . Si no has sido tu, responde este mensaje con la palabra NO. ...";
    const result = parser.parse(sms);
    expect(result!.amount).toBe(249418);
    expect(result!.merchant).toBe("DELTA");
  });

  it("returns null for unrecognized SMS", () => {
    expect(parser.parse("Random text")).toBeNull();
  });
});
