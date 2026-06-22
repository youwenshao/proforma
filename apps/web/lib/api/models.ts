import { apiGet } from "./client";
import {
  modelCurrentFixture,
  modelEvaluationFixture,
  similarMatterEvidenceFixture,
  strategyComparisonFixture,
} from "./fixtures";
import type {
  ModelCurrent,
  ModelEvaluation,
  SimilarMatterEvidence,
  StrategyComparison,
} from "./types";

export async function getCurrentModel(): Promise<ModelCurrent> {
  try {
    return await apiGet<ModelCurrent>("/v1/models/current");
  } catch {
    return modelCurrentFixture;
  }
}

export async function getModelEvaluation(): Promise<ModelEvaluation> {
  try {
    return await apiGet<ModelEvaluation>("/v1/models/evaluation");
  } catch {
    return modelEvaluationFixture;
  }
}

export async function getStrategyComparison(): Promise<StrategyComparison> {
  try {
    return await apiGet<StrategyComparison>("/v1/models/strategy-comparison");
  } catch {
    return strategyComparisonFixture;
  }
}

export async function getSimilarMatterEvidence(): Promise<SimilarMatterEvidence> {
  try {
    return await apiGet<SimilarMatterEvidence>("/v1/models/similar-matter-evidence");
  } catch {
    return similarMatterEvidenceFixture;
  }
}
