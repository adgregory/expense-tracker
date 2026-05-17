import { SmsParser, ParsedSms } from "./types";

export class SmsParserRegistry {
  private parsers = new Map<string, SmsParser>();

  register(parser: SmsParser): void {
    this.parsers.set(parser.bankId, parser);
  }

  parse(sms: string, bankId: string): ParsedSms {
    const result = this.tryParse(sms, bankId);
    if (!result) {
      throw new Error(`Failed to parse SMS for bank "${bankId}": ${sms.substring(0, 80)}...`);
    }
    return result;
  }

  tryParse(sms: string, bankId: string): ParsedSms | null {
    const parser = this.parsers.get(bankId);
    if (!parser) {
      throw new Error(`No parser registered for bank "${bankId}"`);
    }
    return parser.parse(sms);
  }
}
