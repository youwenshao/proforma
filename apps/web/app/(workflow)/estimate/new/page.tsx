import { NewEstimateWorkflow } from "@/components/estimate/new-estimate-workflow";
import { getTaxonomy } from "@/lib/api/taxonomy";

export default async function NewEstimatePage() {
  const taxonomy = await getTaxonomy();

  return <NewEstimateWorkflow taxonomy={taxonomy} />;
}
