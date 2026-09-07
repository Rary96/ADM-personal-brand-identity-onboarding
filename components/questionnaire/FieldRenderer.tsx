"use client";

import type { StepQuestion } from "@/lib/questionnaire-steps";
import { MAX_OBIETTIVI, type Questionario } from "@/lib/schema";
import {
  TextShortField,
  TextLongField,
  EmailFieldInput,
  SingleChoiceField,
} from "@/components/questionnaire/fields/SimpleFields";
import { ChipsField } from "@/components/questionnaire/fields/ChipsField";
import { PillMultiSelectField } from "@/components/questionnaire/fields/PillMultiSelectField";
import { OrderedScaleField } from "@/components/questionnaire/fields/OrderedScaleField";
import { ToneScaleField } from "@/components/questionnaire/fields/ToneScaleField";
import { GridPositionField } from "@/components/questionnaire/fields/GridPositionField";
import { UploadLinkField } from "@/components/questionnaire/fields/UploadLinkField";
import { ColorField } from "@/components/questionnaire/fields/ColorField";
import { Textarea } from "@/components/ui/textarea";

interface FieldRendererProps {
  question: StepQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
}

/**
 * Smista ogni domanda al componente campo giusto. Prima per `id` (i casi
 * speciali, che hanno una UI su misura), poi come fallback per `type`.
 *
 * Resta un dispatcher generico: non deve sapere nulla degli allegati email
 * (che vivono in AttachmentsContext e sono consumati solo da UploadLinkField).
 */
export function FieldRenderer({ question, value, onChange }: FieldRendererProps) {
  switch (question.id) {
    // Testo libero: valori intrinsecamente personali, nessuna tassonomia chiusa
    // avrebbe senso qui.
    case "valori": {
      const v = (value as { selezionati: string[]; altro?: string } | undefined) ?? {
        selezionati: [],
        altro: "",
      };
      return (
        <ChipsField
          values={v.selezionati}
          onChange={(selezionati) => onChange({ ...v, selezionati })}
          placeholder="Scrivi e premi Invio per aggiungere"
          altro={v.altro}
          onAltroChange={(altro) => onChange({ ...v, altro })}
          altroLabel="Altro (facoltativo)"
        />
      );
    }
    // Lista chiusa + "altro", con tetto a MAX_OBIETTIVI per costringere a dare
    // una priorità (vedi la nota in lib/schema.ts).
    case "obiettivoPersonalBrand": {
      const v = (value as { selezionati: string[]; altro?: string } | undefined) ?? {
        selezionati: [],
        altro: "",
      };
      return (
        <div className="flex flex-col gap-6">
          <PillMultiSelectField
            options={question.options ?? []}
            values={v.selezionati}
            onChange={(selezionati) => onChange({ ...v, selezionati })}
            max={MAX_OBIETTIVI}
          />
          <Textarea
            value={v.altro ?? ""}
            onChange={(e) => onChange({ ...v, altro: e.target.value })}
            placeholder="Un altro obiettivo non in lista (facoltativo)"
            rows={2}
            className="resize-none border-0 border-b-2 border-neutral-200 rounded-none px-1 text-base focus-visible:ring-0 focus-visible:border-accent-400"
          />
        </div>
      );
    }
    case "comfortVoltoVideo": {
      const v = (value as string[] | undefined) ?? [];
      return (
        <PillMultiSelectField
          options={question.options ?? []}
          values={v}
          onChange={onChange}
        />
      );
    }
    case "livelloEsposizione":
      return (
        <OrderedScaleField
          options={question.options ?? []}
          value={value as string | undefined}
          onChange={onChange}
          hintStart="Più riservato"
          hintEnd="Più esposto"
        />
      );
    case "mappaPosizionamento":
      return (
        <GridPositionField
          value={value as Questionario["mappaPosizionamento"]}
          onChange={onChange}
        />
      );
    case "toneEParole": {
      const v = (value as Questionario["toneEParole"]) ?? {};
      return <ToneScaleField value={v} onChange={onChange} />;
    }
    case "riferimentiVisivi":
    case "stiliDaEvitare":
    case "materialeFotografico": {
      const v = (value as { urls: string[]; note?: string } | undefined) ?? {
        urls: [],
        note: "",
      };
      return <UploadLinkField fieldId={question.id} value={v} onChange={onChange} />;
    }
    case "colori": {
      const v = (value as Questionario["colori"]) ?? {
        preferiti: [],
        daEvitare: [],
        note: "",
      };
      return <ColorField value={v} onChange={onChange} />;
    }
    default:
      break;
  }

  switch (question.type) {
    case "text-short":
      return <TextShortField value={(value as string) ?? ""} onChange={onChange} />;
    case "text-long":
      return <TextLongField value={(value as string) ?? ""} onChange={onChange} />;
    case "email":
      return <EmailFieldInput value={(value as string) ?? ""} onChange={onChange} />;
    case "single-choice":
      return (
        <SingleChoiceField
          options={question.options ?? []}
          value={value as string | undefined}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}
