export interface ParsedSms {
  amount: number;
  merchant: string;
  cardLast4: string;
  date: string;
  time: string;
}

export interface SmsParser {
  bankId: string;
  parse(sms: string): ParsedSms | null;
}
