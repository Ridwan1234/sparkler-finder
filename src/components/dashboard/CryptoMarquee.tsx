import { useCryptoTicker } from "@/hooks/useCryptoPrices";
import { TrendingUp, TrendingDown } from "lucide-react";

export function CryptoMarquee() {
  const { data: ticker } = useCryptoTicker();

  if (!ticker || ticker.length === 0) return null;

  // Duplicate items for seamless infinite scroll
  const items = [...ticker, ...ticker, ...ticker];

  return (
    <div className="w-full overflow-hidden bg-sidebar-accent/50 border-b border-sidebar-border">
      <div className="animate-marquee flex items-center gap-8 py-2 whitespace-nowrap">
        {items.map((t, i) => {
          const up = t.price_change_percentage_24h >= 0;
          return (
            <div key={`${t.id}-${i}`} className="flex items-center gap-2 text-xs shrink-0">
              <img src={t.image} alt={t.symbol} className="w-4 h-4 rounded-full" />
              <span className="font-semibold text-section-dark-foreground uppercase">{t.symbol}</span>
              <span className="text-section-dark-foreground">${t.current_price.toLocaleString()}</span>
              <span className={`flex items-center gap-0.5 ${up ? "text-primary" : "text-destructive"}`}>
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {up ? "+" : ""}{t.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
