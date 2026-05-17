import { describe, it, expect } from "vitest";
import { SmsParserRegistry } from "@/lib/sms/registry";
import { BancoDeBogotaParser } from "@/lib/sms/banks/banco-de-bogota";

describe("SmsParserRegistry", () => {
  it("parses SMS with registered bank parser", () => {
    const registry = new SmsParserRegistry();
    registry.register(new BancoDeBogotaParser());
    const result = registry.parse(
      "Banco de Bogota: Tu compra por 26,706 fue aprobada con Tarjeta Crédito 4910 el 10/05/26 21:25:35 en UBER RIDES ¿Dudas? Llama a la Servilinea ...",
      "banco_de_bogota"
    );
    expect(result.amount).toBe(26706);
  });

  it("throws for unregistered bank", () => {
    const registry = new SmsParserRegistry();
    expect(() => registry.parse("test", "bancolombia")).toThrow('No parser registered for bank "bancolombia"');
  });

  it("throws for unparseable SMS", () => {
    const registry = new SmsParserRegistry();
    registry.register(new BancoDeBogotaParser());
    expect(() => registry.parse("random text", "banco_de_bogota")).toThrow("Failed to parse SMS");
  });

  it("tryParse returns null for unparseable SMS", () => {
    const registry = new SmsParserRegistry();
    registry.register(new BancoDeBogotaParser());
    expect(registry.tryParse("random text", "banco_de_bogota")).toBeNull();
  });
});
