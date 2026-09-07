import { sections, type Question } from "@/content/questionnaire";
import type { Questionario } from "@/lib/schema";
import { getOptionLabel, getOptionLabels } from "@/lib/questionnaire-labels";

export interface EmailField {
  label: string;
  value: string;
}

export interface EmailSection {
  title: string;
  fields: EmailField[];
}

const join = (arr?: string[]) => (arr ?? []).join(", ");

function formatValue(question: Question, data: Questionario): string {
  const raw = (data as Record<string, unknown>)[question.id];

  switch (question.id) {
    case "valori": {
      const v = raw as { selezionati?: string[]; altro?: string } | undefined;
      return [join(v?.selezionati), v?.altro ? `Altro: ${v.altro}` : ""]
        .filter(Boolean)
        .join(" · ");
    }
    case "obiettivoPersonalBrand": {
      const v = raw as { selezionati?: string[]; altro?: string } | undefined;
      return [
        join(getOptionLabels("obiettivoPersonalBrand", v?.selezionati)),
        v?.altro ? `Altro: ${v.altro}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
    }
    case "comfortVoltoVideo":
      return join(getOptionLabels("comfortVoltoVideo", raw as string[] | undefined));
    case "archetipo":
    case "tipologiaMarchio":
    case "livelloEsposizione":
      return getOptionLabel(question.id, raw as string | undefined);
    case "mappaPosizionamento": {
      const v = raw as Questionario["mappaPosizionamento"];
      if (!v) return "";
      return `Istituzionale↔Personale: ${v.istituzionalePersonale} · Tecnico↔Divulgativo: ${v.tecnicoDivulgativo}`;
    }
    case "toneEParole": {
      const v = raw as Questionario["toneEParole"];
      if (!v) return "";
      return [
        v.formaleInformale != null ? `Formale↔Informale: ${v.formaleInformale}` : "",
        v.tecnicoSemplice != null ? `Tecnico↔Semplice: ${v.tecnicoSemplice}` : "",
        v.serioIronico != null ? `Serio↔Ironico: ${v.serioIronico}` : "",
        v.paroleSempre ? `Parole sì: ${v.paroleSempre}` : "",
        v.paroleMai ? `Parole no: ${v.paroleMai}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
    }
    case "riferimentiVisivi":
    case "stiliDaEvitare":
    case "materialeFotografico": {
      const v = raw as { urls?: string[]; note?: string } | undefined;
      return [join(v?.urls), v?.note ? `Note: ${v.note}` : ""].filter(Boolean).join(" · ");
    }
    case "colori": {
      const v = raw as Questionario["colori"];
      if (!v) return "";
      return [
        v.preferiti?.length ? `Preferiti: ${join(v.preferiti)}` : "",
        v.daEvitare?.length ? `Da evitare: ${join(v.daEvitare)}` : "",
        v.note ? `Note: ${v.note}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
    }
    default:
      return typeof raw === "string" ? raw : raw != null ? String(raw) : "";
  }
}

/**
 * Costruisce la struttura sezione→campi per il riepilogo email, iterando le
 * stesse `sections`/`questions` di content/questionnaire.ts (fonte di verità
 * condivisa con la UI) — se cambia una domanda nel content, l'email si
 * aggiorna da sola. Omette i campi facoltativi lasciati vuoti.
 *
 * Niente filtro sulle domande visibili: questo questionario non ha branching
 * (vedi lib/questionnaire-steps.ts), quindi tutte le domande sono sempre
 * pertinenti.
 */
export function buildEmailSections(data: Questionario): EmailSection[] {
  return sections
    .map((section) => {
      const fields = section.questions
        .map((q) => ({ label: q.label, value: formatValue(q, data) }))
        .filter((f) => f.value.trim().length > 0);
      return { title: section.title, fields };
    })
    .filter((section) => section.fields.length > 0);
}
