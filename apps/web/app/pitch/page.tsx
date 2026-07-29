import type { Metadata } from "next";
import { PitchExperience } from "@/components/pitch/pitch-experience";

export const metadata: Metadata = {
  title: "ProForma HK — Think Tank 2026 Pitch",
  description:
    "ProForma helps Hong Kong law firms quote fixed and capped fees using structured inputs and comparable-matter analysis. Think Tank 2026 proposal by Sentimento Technologies Limited.",
};

export default function PitchPage() {
  return <PitchExperience />;
}
