import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/EmailLayout";
import { SectionBlock } from "@/emails/components/SectionBlock";
import { buildEmailSections } from "@/lib/email-sections";
import { getOptionLabel, getOptionLabels } from "@/lib/questionnaire-labels";
import { colors } from "@/lib/design-tokens";
import type { Questionario } from "@/lib/schema";

interface InternalSummaryEmailProps {
  data: Questionario;
  submissionId: string;
}

export function InternalSummaryEmail({ data, submissionId }: InternalSummaryEmailProps) {
  const emailSections = buildEmailSections(data);
  // In evidenza il segnale che orienta più di ogni altro la direzione visiva
  // (vedi la nota su `livelloEsposizione` in lib/schema.ts), più gli obiettivi.
  const esposizioneLabel = getOptionLabel("livelloEsposizione", data.livelloEsposizione);
  const obiettiviLabel = getOptionLabels(
    "obiettivoPersonalBrand",
    data.obiettivoPersonalBrand.selezionati
  ).join(" · ");

  return (
    <EmailLayout preview={`Nuova submission — ${data.nomeCognome}`}>
      <Heading as="h2" style={{ fontSize: 20, color: colors.neutral[900], margin: "0 0 4px" }}>
        Nuova risposta al questionario — {data.nomeCognome}
      </Heading>
      <Text style={{ fontSize: 13, color: colors.neutral[400], margin: "0 0 24px" }}>
        ID submission {submissionId}
      </Text>

      <Section
        style={{
          backgroundColor: colors.accent[50],
          border: `1px solid ${colors.accent[200]}`,
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 28,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: 700, color: colors.neutral[900], margin: "0 0 8px" }}>
          {data.nomeCognome}
          {data.nomeBrand ? ` — “${data.nomeBrand}”` : ""}
        </Text>
        <Text style={{ fontSize: 13, lineHeight: 1.7, color: colors.neutral[700], margin: 0 }}>
          {data.email}
          <br />
          {data.professione}
          {data.profiliOnline ? (
            <>
              <br />
              {data.profiliOnline}
            </>
          ) : null}
          {esposizioneLabel ? (
            <>
              <br />
              <span style={{ color: colors.accent[700], fontWeight: 600 }}>
                Esposizione: {esposizioneLabel}
              </span>
            </>
          ) : null}
          {obiettiviLabel ? (
            <>
              <br />
              Obiettivi: {obiettiviLabel}
            </>
          ) : null}
        </Text>
      </Section>

      {emailSections.map((section) => (
        <SectionBlock key={section.title} section={section} />
      ))}
    </EmailLayout>
  );
}

export default InternalSummaryEmail;
