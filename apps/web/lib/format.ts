export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-HK", {
    currency: "HKD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-HK", {
    maximumFractionDigits,
  }).format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("en-HK", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value);
}
