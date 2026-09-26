import { useFormatCurrency, useFormatNumber } from "katanakit-js";

// Formateo único de la app: importes en euros y números en es-ES.
export function formatEuro(amount: number): string {
  return useFormatCurrency({ amount, currency: "EUR", locale: "es" });
}

export function formatKm(value: number): string {
  return useFormatNumber(value, "es", 0);
}
