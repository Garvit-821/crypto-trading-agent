const CRYPTO_PAIRS = [
  'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT',
  'DOGE/USDT', 'SOL/USDT', 'DOT/USDT', 'MATIC/USDT', 'LTC/USDT',
  'AVAX/USDT', 'LINK/USDT', 'UNI/USDT', 'ATOM/USDT', 'XLM/USDT',
  'ALGO/USDT', 'VET/USDT', 'FIL/USDT', 'TRX/USDT', 'ETC/USDT',
  'NEAR/USDT', 'AAVE/USDT', 'SAND/USDT', 'MANA/USDT', 'AXS/USDT',
  'FTM/USDT', 'HBAR/USDT', 'EGLD/USDT', 'XTZ/USDT', 'THETA/USDT',
  'ICP/USDT', 'EOS/USDT', 'FLOW/USDT', 'APE/USDT', 'CHZ/USDT',
  'CAKE/USDT', 'GRT/USDT', 'ENJ/USDT', 'QNT/USDT', 'KSM/USDT',
  'ZEC/USDT', 'RUNE/USDT', 'MKR/USDT', 'SNX/USDT', 'COMP/USDT',
  'CRV/USDT', 'SUSHI/USDT', 'YFI/USDT', '1INCH/USDT', 'BAT/USDT'
];

const CONDITION_TYPES = [
  { type: 'EMA Crossover', message: 'EMA crossover detected' },
  { type: 'RSI Oversold', message: 'RSI < 30 — Oversold signal' },
  { type: 'RSI Overbought', message: 'RSI > 70 — Overbought signal' },
  { type: 'MACD Signal', message: 'MACD bullish crossover' },
  { type: 'Bollinger Bounce', message: 'Price hit lower Bollinger Band' },
  { type: 'Volume Spike', message: 'Unusual volume detected' },
  { type: 'Support Break', message: 'Key support level broken' },
  { type: 'Resistance Break', message: 'Key resistance level broken' }
];

export interface MarketData {
  coin: string;
  price: number;
  change24h: number;
  volume: number;
  lastUpdate: Date;
}

export interface AlertTrigger {
  coin_name: string;
  condition_type: string;
  condition_message: string;
  entry_price: number;
  stop_loss: number;
  target_price: number;
}

export class MarketSimulator {
  private marketData: Map<string, MarketData> = new Map();
  private basePrice: Map<string, number> = new Map();

  constructor() {
    this.initializeMarketData();
  }

  private initializeMarketData() {
    CRYPTO_PAIRS.forEach(coin => {
      const basePrice = this.generateBasePrice(coin);
      this.basePrice.set(coin, basePrice);

      this.marketData.set(coin, {
        coin,
        price: basePrice,
        change24h: (Math.random() - 0.5) * 20,
        volume: Math.random() * 1000000000,
        lastUpdate: new Date()
      });
    });
  }

  private generateBasePrice(coin: string): number {
    if (coin.startsWith('BTC')) return 42000 + Math.random() * 1000;
    if (coin.startsWith('ETH')) return 2200 + Math.random() * 100;
    if (coin.startsWith('BNB')) return 300 + Math.random() * 20;
    if (coin.startsWith('SOL')) return 90 + Math.random() * 10;
    if (coin.startsWith('XRP')) return 0.5 + Math.random() * 0.1;
    if (coin.startsWith('ADA')) return 0.4 + Math.random() * 0.05;
    if (coin.startsWith('DOGE')) return 0.08 + Math.random() * 0.01;
    return Math.random() * 100;
  }

  updateMarketData() {
    this.marketData.forEach((data, coin) => {
      const basePrice = this.basePrice.get(coin) || data.price;
      const volatility = 0.002;
      const change = (Math.random() - 0.5) * volatility;

      data.price = basePrice * (1 + change);
      data.change24h += (Math.random() - 0.5) * 0.5;
      data.volume = data.volume * (1 + (Math.random() - 0.5) * 0.1);
      data.lastUpdate = new Date();
    });
  }

  getMarketData(coin: string): MarketData | undefined {
    return this.marketData.get(coin);
  }

  getAllMarketData(): MarketData[] {
    return Array.from(this.marketData.values());
  }

  generateRandomAlert(): AlertTrigger | null {
    if (Math.random() > 0.15) return null;

    const coin = CRYPTO_PAIRS[Math.floor(Math.random() * CRYPTO_PAIRS.length)];
    const condition = CONDITION_TYPES[Math.floor(Math.random() * CONDITION_TYPES.length)];
    const marketData = this.marketData.get(coin);

    if (!marketData) return null;

    const entryPrice = marketData.price;
    const stopLossPercent = 0.02 + Math.random() * 0.03;
    const targetPercent = 0.03 + Math.random() * 0.07;

    return {
      coin_name: coin,
      condition_type: condition.type,
      condition_message: condition.message,
      entry_price: Number(entryPrice.toFixed(4)),
      stop_loss: Number((entryPrice * (1 - stopLossPercent)).toFixed(4)),
      target_price: Number((entryPrice * (1 + targetPercent)).toFixed(4))
    };
  }
}

export const marketSimulator = new MarketSimulator();
