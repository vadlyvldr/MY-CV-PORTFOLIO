import { getDefaultCvData } from "@/lib/cv-data";
import { PortfolioView } from "@/components/PortfolioView";

export default function HomePage() {
  const data = getDefaultCvData();
  return <PortfolioView initialData={data} />;
}
