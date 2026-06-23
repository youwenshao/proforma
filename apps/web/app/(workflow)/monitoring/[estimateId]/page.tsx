import { MonitoringPageContent } from "@/components/monitoring/monitoring-page-content";
import { getEstimate } from "@/lib/api/estimates";

type MonitoringPageProps = {
  params: Promise<{ estimateId: string }>;
};

export default async function MonitoringPage({ params }: MonitoringPageProps) {
  const { estimateId } = await params;
  const estimate = await getEstimate(estimateId);

  return <MonitoringPageContent estimate={estimate} estimateId={estimateId} />;
}
