import tradeSchema from "./Trade.json";

export class Trade {
  static key = "trades_db";

  static schema() {
    return tradeSchema;
  }

  // 🔹 Henter alle trades, sortert etter valgt felt
  static async list(orderBy = "-entry_date") {
    const data = JSON.parse(localStorage.getItem(this.key) || "[]");
    return this.sort(data, orderBy);
  }

  // 🔹 Sorteringsfunksjon (standard: nyeste først)
  static sort(data, orderBy) {
    if (!orderBy) return data;
    const desc = orderBy.startsWith("-");
    const field = orderBy.replace("-", "");
    return data.sort((a, b) => {
      const va = new Date(a[field]);
      const vb = new Date(b[field]);
      return desc ? vb - va : va - vb;
    });
  }

  // 🔹 Legger til nye trades uten å slette gamle
  static async bulkCreate(trades = []) {
    const existing = JSON.parse(localStorage.getItem(this.key) || "[]");

    // Sjekk for duplikater (basert på ticket + entry_date)
    const existingKeys = new Set(existing.map(t => `${t.ticket}-${t.entry_date}`));
    const filtered = trades.filter(
      t => !existingKeys.has(`${t.ticket}-${t.entry_date}`)
    );

    const merged = [...existing, ...filtered];
    localStorage.setItem(this.key, JSON.stringify(merged));
    return merged;
  }

  // 🔹 Fjern alle trades (brukes kun hvis man vil resette)
  static clearAll() {
    localStorage.removeItem(this.key);
  }

  // 🔹 Hent statistikk (kan brukes på dashboard senere)
  static async stats() {
    const trades = await this.list();
    const totalPnL = trades.reduce((s, t) => s + (t.profit_loss || 0), 0);
    const oteTrades = trades.filter(t => t.used_ote);
    const fvgTrades = trades.filter(t => t.used_fvg);
    const obTrades = trades.filter(t => t.used_ob);
    const mbTrades = trades.filter(t => t.used_mb);
    const bbTrades = trades.filter(t => t.used_bb);

    return {
      totalPnL,
      totalTrades: trades.length,
      oteCount: oteTrades.length,
      fvgCount: fvgTrades.length,
      obCount: obTrades.length,
      mbCount: mbTrades.length,
      bbCount: bbTrades.length,
      otePercent: (oteTrades.length / trades.length) * 100 || 0,
      fvgPercent: (fvgTrades.length / trades.length) * 100 || 0,
      obPercent: (obTrades.length / trades.length) * 100 || 0,
      mbPercent: (mbTrades.length / trades.length) * 100 || 0,
      bbPercent: (bbTrades.length / trades.length) * 100 || 0,
    };
  }
}
