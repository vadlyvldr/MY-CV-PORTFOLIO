import type { Metadata } from "next";
import { getDefaultCvData } from "@/lib/cv-data";
import { AtsResumeView } from "@/components/AtsResumeView";

export const metadata: Metadata = {
  title: "CV / Resume (ATS PDF) — Muhammad Ryan Fadliansyah (Fadli)",
  description: "Printable ATS-friendly curriculum vitae for Muhammad Ryan Fadliansyah.",
};

export default function ResumePage() {
  const data = getDefaultCvData();
  return <AtsResumeView initialData={data} />;
}
