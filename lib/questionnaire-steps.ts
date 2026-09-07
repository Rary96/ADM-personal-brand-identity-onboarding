import { sections, type Question } from "@/content/questionnaire";

export interface StepQuestion extends Question {
  sectionId: string;
  sectionTitle: string;
  sectionIntro?: string;
  isFirstOfSection: boolean;
}

/**
 * Elenco piatto di tutte le domande, nell'ordine in cui compaiono nel wizard.
 *
 * Qui non c'è nessun filtro: questo questionario non ha branching (vedi la
 * nota in lib/schema.ts), quindi tutte le domande sono sempre visibili e la
 * lista è la stessa per chiunque compili. È il motivo per cui la funzione non
 * prende argomenti, a differenza del progetto gemello dove filtrava le
 * domande in base al campo discriminante nuovo brand / restyling.
 */
export function buildSteps(): StepQuestion[] {
  const steps: StepQuestion[] = [];

  for (const section of sections) {
    let isFirst = true;
    for (const question of section.questions) {
      steps.push({
        ...question,
        sectionId: section.id,
        sectionTitle: section.title,
        sectionIntro: section.intro,
        isFirstOfSection: isFirst,
      });
      isFirst = false;
    }
  }

  return steps;
}
