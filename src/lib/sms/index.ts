import { SmsParserRegistry } from "./registry";
import { BancoDeBogotaParser } from "./banks/banco-de-bogota";

export { normalizeMerchant } from "./normalizer";
export { SmsParserRegistry } from "./registry";
export type { ParsedSms, SmsParser } from "./types";

const registry = new SmsParserRegistry();
registry.register(new BancoDeBogotaParser());

export const smsRegistry = registry;
