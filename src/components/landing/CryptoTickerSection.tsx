import { useState } from "react";
import { useCryptoChart, useCryptoTicker } from "@/hooks/useCryptoPrices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTranslation } from "react-i18next";

export default function CryptoTickerSection() {
  const { t } = useTranslation();
  const [coin, setCoin] = useState<"BTC" | "ETH" | "BNB">("BTC");
  const [days, setDays] = useState<number>(30);
  const { data: ticker, isLoading: tickerLoading } = useCryptoTicker();
  const { data: chartData, isLoading: chartLoading } = useCryptoChart(coin, days);

  const COIN_MAP: Record<string, string> = { BTC: "bitcoin", ETH: "ethereum", BNB: "binancecoin" };
  const activeTicker = ticker?.find((t) => t.id === COIN_MAP[coin]);
  const isUp = (activeTicker?.price_change_percentage_24h ?? 0) >= 0;

  return (
    <section className="py-20 section-dark">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-section-dark-foreground mb-3">
            {t("cryptoTicker.title")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t("cryptoTicker.description")}
          </p>
        </div>

        {/* Ticker cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {(["BTC", "ETH", "BNB"] as const).map((sym) => {
            const t = ticker?.find((x) => x.id === COIN_MAP[sym]);
            const up = (t?.price_change_percentage_24h ?? 0) >= 0;
            return (
              <button
                key={sym}
                onClick={() => setCoin(sym)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  coin === sym
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/10 bg-card/5 hover:border-border/20"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {t?.image && <img src={t.image} alt={sym} className="w-7 h-7 rounded-full" />}
                  <span className="font-display font-semibold text-section-dark-foreground">{sym}</span>
                </div>
                <p className="text-lg font-bold text-section-dark-foreground">
                  {t ? `$${t.current_price.toLocaleString()}` : "—"}
                </p>
                <p className={`text-xs font-medium flex items-center gap-1 ${up ? "text-primary" : "text-destructive"}`}>
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {t ? `${up ? "+" : ""}${t.price_change_percentage_24h.toFixed(2)}%` : "—"} (24h)
                </p>
              </button>
            );
          })}
        </div>

        {/* Chart */}
        <Card className="bg-card/5 border-border/10">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
            <CardTitle className="text-section-dark-foreground text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {coin}/USD
              {activeTicker && (
                <span className={`text-sm font-medium ml-2 ${isUp ? "text-primary" : "text-destructive"}`}>
                  {isUp ? "+" : ""}{activeTicker.price_change_percentage_24h.toFixed(2)}%
                </span>
              )}
            </CardTitle>
            <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
              <TabsList className="h-8 bg-background/10">
                <TabsTrigger value="7" className="text-xs px-2.5 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">7D</TabsTrigger>
                <TabsTrigger value="30" className="text-xs px-2.5 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">30D</TabsTrigger>
                <TabsTrigger value="90" className="text-xs px-2.5 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">90D</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {chartLoading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">{t("common.loading")}</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData ?? []} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="landingPriceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(152, 87%, 30%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(152, 87%, 30%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(155, 20%, 18%)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(150, 10%, 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`} domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{ background: "hsl(155, 25%, 9%)", border: "1px solid hsl(155, 20%, 18%)", borderRadius: "8px", fontSize: "12px", color: "hsl(150, 10%, 90%)" }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, coin]}
                    />
                    <Area type="monotone" dataKey="price" stroke="hsl(152, 87%, 30%)" strokeWidth={2} fill="url(#landingPriceGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
