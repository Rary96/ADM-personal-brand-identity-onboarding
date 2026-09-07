import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Prima di iniziare, parlami di te — Onboarding Personal Brand",
  description:
    "Questionario preparatorio alla call di kickoff per lo sviluppo della tua personal brand identity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={montserrat.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
