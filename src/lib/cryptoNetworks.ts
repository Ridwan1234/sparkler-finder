export interface CryptoNetwork {
  value: string;
  label: string;
  logo: string;
}

export const CRYPTO_NETWORKS: CryptoNetwork[] = [
  { value: "BTC", label: "Bitcoin (BTC)", logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  { value: "ETH", label: "Ethereum (ETH)", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { value: "USDT-TRC20", label: "USDT (TRC20)", logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png" },
  { value: "USDT-ERC20", label: "USDT (ERC20)", logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png" },
  { value: "USDC", label: "USD Coin (USDC)", logo: "https://assets.coingecko.com/coins/images/6319/small/usdc.png" },
  { value: "BNB", label: "BNB (BSC)", logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
  { value: "SOL", label: "Solana (SOL)", logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
  { value: "XRP", label: "Ripple (XRP)", logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png" },
  { value: "LTC", label: "Litecoin (LTC)", logo: "https://assets.coingecko.com/coins/images/2/small/litecoin.png" },
  { value: "DOGE", label: "Dogecoin (DOGE)", logo: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png" },
  { value: "TRX", label: "TRON (TRX)", logo: "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png" },
  { value: "MATIC", label: "Polygon (MATIC)", logo: "https://assets.coingecko.com/coins/images/4713/small/polygon.png" },
];

export function getNetworkByValue(value: string): CryptoNetwork | undefined {
  return CRYPTO_NETWORKS.find((n) => n.value === value);
}
