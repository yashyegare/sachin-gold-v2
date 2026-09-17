import type { Metadata } from "next";
import { rates, ratesLastUpdated } from "@/data/rates";

export const metadata: Metadata = { title: "Market Rates" };

export default function RatesPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl text-ink">Current Market Rates</h1>
      <table className="mt-10 w-full border-collapse text-sm">
        <tbody>
          {rates.map((rate) => (
            <tr key={rate.product} className="border-b border-ink/10">
              <td className="py-3 text-ink/80">{rate.product}</td>
              <td className="py-3 text-right text-ink">
                {rate.price} <span className="text-ink/50">{rate.unit}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-ink/50">Last updated: {ratesLastUpdated}</p>
    </section>
  );
}
