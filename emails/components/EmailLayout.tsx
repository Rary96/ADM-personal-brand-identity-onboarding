import {
  Html,
  Head,
  Body,
  Container,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { colors } from "@/lib/design-tokens";
import { siteUrl } from "@/lib/site-url";

interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="it">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: colors.neutral[50],
          fontFamily: "Helvetica, Arial, sans-serif",
          margin: 0,
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: colors.neutral[0],
            borderRadius: 16,
            padding: 32,
            maxWidth: 560,
          }}
        >
          <Section
            style={{
              borderBottom: `3px solid ${colors.accent[300]}`,
              paddingBottom: 16,
              marginBottom: 24,
            }}
          >
            {/* URL assoluto obbligatorio: i client email non risolvono i
                percorsi relativi. Vedi lib/site-url.ts. */}
            <Img
              src={`${siteUrl}/logo-adm-esteso.png`}
              alt="ADM — Arianna Dal Monte, Design &amp; Digital"
              width={140}
              height={77}
              style={{ display: "block", border: 0, marginBottom: 12 }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: colors.accent[600],
                letterSpacing: 0.5,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Onboarding Personal Brand
            </Text>
          </Section>

          {children}

          <Section
            style={{
              borderTop: `1px solid ${colors.neutral[200]}`,
              marginTop: 32,
              paddingTop: 16,
            }}
          >
            <Text style={{ fontSize: 12, color: colors.neutral[400], margin: 0 }}>
              ADM — Design & Digital
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
