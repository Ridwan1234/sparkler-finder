import { useQuery } from "@tanstack/react-query";

export interface CryptoPricePoint {
  date: string;
  price: number;
}

export interface CryptoCurrentPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

const COIN_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
};

export function useCryptoChart(coin: string, days: number) {
  return useQuery<CryptoPricePoint[]>({
    queryKey: ["crypto_chart", coin, days],
    queryFn: async () => {
      const coinId = COIN_IDS[coin] ?? "bitcoin";
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      if (!res.ok) throw new Error("Failed to fetch chart data");
      const json = await res.json();
      // prices is [[timestamp, price], ...]
      const prices: [number, number][] = json.prices ?? [];
      // Sample down for large datasets
      const step = Math.max(1, Math.floor(prices.length / 90));
      return prices
        .filter((_, i) => i % step === 0 || i === prices.length - 1)
        .map(([ts, price]) => ({
          date: new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          price: Math.round(price * 100) / 100,
        }));
    },
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 1,
  });
}

export function useCryptoTicker() {
  return useQuery<CryptoCurrentPrice[]>({
    queryKey: ["crypto_ticker"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin&order=market_cap_desc&sparkline=false"
      );
      if (!res.ok) throw new Error("Failed to fetch ticker");
      return res.json();
    },
    staleTime: 60 * 1000,
    retry: 1,
  });
}
