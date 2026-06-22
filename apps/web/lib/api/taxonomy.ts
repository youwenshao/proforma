import { apiGet } from "./client";
import { syntheticTaxonomy } from "./fixtures";
import type { Taxonomy } from "./types";

export async function getTaxonomy(): Promise<Taxonomy> {
  try {
    const taxonomy = await apiGet<Omit<Taxonomy, "client_types">>("/v1/taxonomy");

    return {
      ...taxonomy,
      client_types: syntheticTaxonomy.client_types,
    };
  } catch {
    return syntheticTaxonomy;
  }
}
