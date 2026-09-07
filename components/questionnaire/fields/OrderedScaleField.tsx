"use client";

import { cn } from "@/lib/utils";
import type { Question } from "@/content/questionnaire";

interface OrderedScaleFieldProps {
  options: NonNullable<Question["options"]>;
  value?: string;
  onChange: (value: string) => void;
  /** Etichetta dell'estremo "basso" della scala (es. "Più riservato"). */
  hintStart?: string;
  /** Etichetta dell'estremo "alto" della scala (es. "Più esposto"). */
  hintEnd?: string;
}

/**
 * Scelta singola su opzioni ORDINATE (una scala, non un set alla pari):
 * l'ordine in cui arrivano da `content/questionnaire.ts` è significativo e
 * viene reso esplicito dall'indice numerato a sinistra e dai due `hint` agli
 * estremi.
 *
 * Impaginazione verticale, non a segmenti orizzontali: le opzioni di questo
 * questionario sono frasi intere (vedi `livelloEsposizione`), che in
 * segmenti affiancati risulterebbero illeggibili su mobile.
 */
export function OrderedScaleField({
  options,
  value,
  onChange,
  hintStart,
  hintEnd,
}: OrderedScaleFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      {hintStart ? (
        <span className="text-xs text-neutral-400">{hintStart}</span>
      ) : null}

      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-sm transition-colors",
                selected
                  ? "border-accent-500 bg-accent-100 text-neutral-900"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-accent-300 hover:bg-accent-50"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  selected
                    ? "bg-accent-500 text-white"
                    : "bg-neutral-100 text-neutral-400"
                )}
              >
                {i + 1}
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {hintEnd ? (
        <span className="text-xs text-neutral-400">{hintEnd}</span>
      ) : null}
    </div>
  );
}
