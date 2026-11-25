import type { Metadata } from "next";
import { getDefaultCvData } from "@/lib/cv-data";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Editor — Fadli Portfolio",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const data = getDefaultCvData();
  return <AdminDashboard initialData={data} />;
}
