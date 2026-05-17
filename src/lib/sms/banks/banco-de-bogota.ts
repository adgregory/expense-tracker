import { SmsParser, ParsedSms } from "../types";

export class BancoDeBogotaParser implements SmsParser {
  bankId = "banco_de_bogota";

  private formatA = /Tu compra por ([\d.,]+) fue aprobada con Tarjeta Cr[eé]dito (\d{4}) el (\d{2})\/(\d{2})\/(\d{2}) (\d{2}:\d{2}:\d{2}) en (.+?)(?:\s*¿Dudas\?|$)/;
  private formatB = /Tu transaccion fue aprobada con T\. Credito #(\d{4}) por \$([\d.,]+) en (.+?)(?:\s*\.\s*Si no has sido tu|$)/;

  parse(sms: string): ParsedSms | null {
    let match = this.formatA.exec(sms);
    if (match) {
      const amount = parseInt(match[1].replace(/[.,]/g, ""), 10);
      const card = match[2];
      const day = match[3];
      const month = match[4];
      const year = `20${match[5]}`;
      const time = match[6];
      const merchant = match[7].trim();

      return { amount, merchant, cardLast4: card, date: `${year}-${month}-${day}`, time };
    }

    match = this.formatB.exec(sms);
    if (match) {
      const card = match[1];
      const amount = parseInt(match[2].replace(/[.,]/g, ""), 10);
      const merchant = match[3].trim();
      const now = new Date();

      return {
        amount, merchant, cardLast4: card,
        date: now.toISOString().split("T")[0],
        time: now.toTimeString().split(" ")[0],
      };
    }

    return null;
  }
}
