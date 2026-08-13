import { DEALSNAP_BUILD_SPEC, underwriteDeal, type DealNumbers, type UnderwritingStrategy } from "./dealsnap_templates";

export { DEALSNAP_BUILD_SPEC, underwriteDeal };
export type { DealNumbers, UnderwritingStrategy };

export const COMMANDER_CONTRACT = {
  supabaseProjectId: "egpqhzubdeklzstzdmtt",
  propertyTable: "public.properties",
  buyerTable: "public.buyers",
  intakeTable: "public.deal_intakes",
  underwritingTable: "public.underwriting_cases",
  notionSources: DEALSNAP_BUILD_SPEC.notionSources,
  workflowStatuses: DEALSNAP_BUILD_SPEC.portals.internal.statuses,
  decisions: DEALSNAP_BUILD_SPEC.portals.internal.decisions,
  strategies: ["LOA", "SubTo", "Wrap", "Cash", "Arbitrage"] as const,
} as const;

export function normalizeIntake(input: Record<string, unknown>) {
  const mapped: Record<string, unknown> = {};
  for (const [source, target] of Object.entries(DEALSNAP_BUILD_SPEC.sourceToSupabase)) {
    if (input[source] !== undefined) mapped[target] = input[source];
  }
  const unmapped = Object.fromEntries(Object.entries(input).filter(([key]) => !(key in DEALSNAP_BUILD_SPEC.sourceToSupabase)));
  return { mapped, source_payload: unmapped };
}

export function evaluateStrategies(numbers: DealNumbers) {
  return COMMANDER_CONTRACT.strategies.map((strategy) => underwriteDeal(strategy, numbers));
}
