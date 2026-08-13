// Canonical DealSnap / REI Elite Deal Room copy, field mappings, and workflow contracts.
export const DEALSNAP_BUILD_SPEC = {
  contact: { name: "Chris Colton", phone: "210-756-9075", email: "reiprofessions@gmail.com" },
  intake: {
    purpose: "Creative Finance Deal Intake Form",
    sections: {
      submitter: ["name", "phone", "email", "role", "source"],
      property: ["address", "city", "state", "zip", "property_type", "beds", "baths", "sqft", "year_built", "occupancy", "current_rent"],
      seller: ["owner_name", "owner_phone", "owner_email", "best_time", "motivation", "why_selling", "timeline"],
      terms: ["asking_price", "arv", "repairs", "existing_mortgage", "mortgage_balance", "monthly_mortgage_payment", "interest_rate", "loan_type", "open_to_creative_finance", "acceptable_options", "min_cash_upfront", "desired_monthly_payment", "desired_balloon_payoff"],
      condition: ["condition", "major_issues", "repair_description", "photos_link", "documents_link"],
      fit: ["preferred_exit_strategy", "buyer_already_interested", "buyer_details", "anything_else"]
    },
    confirmation: "Thank you — we received the deal and will review the property, terms, and next steps."
  },
  portals: {
    seller: { status: "Under Review", next_step: "Property + terms review", review_factors: ["price", "terms", "condition", "title", "exit viability"], structures: ["Cash Offer", "Lease Option", "Subject-To", "Seller Finance", "Owner-Finance Buyer Placement"], documents_needed: ["mortgage statement", "tax/insurance details", "lease or rent roll", "photos", "title/HOA documents"] },
    buyer: { status: "Intake / Qualification", next_step: "Confirm criteria and readiness", qualification_targets: { income_multiple: "2.5–3x monthly payment", credit: "500–680+", option_fee: "3%–10%", financing_plan: "8–12 months", employment: "stable W2 or documentable self-employed" }, buying_options: ["Lease Option", "Owner Finance", "Subject-To", "Cash", "Partner JV"] },
    internal: { statuses: ["Active", "Waiting", "Dead", "Nurture", "Hot", "Warm", "Cold"], decisions: ["Pursue", "Nurture", "Pass"], owners: ["Chris", "Acquisitions", "Dispo", "Admin/Ops"], strategy_review: ["Lease Option Assignment", "Subject-To", "Seller Finance/Wrap", "Cash/Flip", "Rental/Arbitrage/Sober Living"] }
  },
  notionSources: [
    { id: "866e8ea601ee4af8999bc205e830bb56", name: "Tenant-Buyer Lead Hunt", buyerType: "tenant_buyer" },
    { id: "f6f420d6-05d6-4dc0-a54b-f51d331cbec3", name: "Tenant-Buyer Buy Boxes", buyerType: "tenant_buyer" },
    { id: "6752f20c-f9f9-449b-b23e-9fd2f323b54c", name: "Buy Boxes (Investors)", buyerType: "investor" }
  ],
  sourceToSupabase: { address: "address_line1", asking_price: "asking_price", arv: "arv", repairs: "rehab_budget", mortgage_balance: "existing_loan_balance", monthly_mortgage_payment: "monthly_piti", current_rent: "cash_flow", property_type: "property_type", preferred_exit_strategy: "strategy_tags" }
} as const;

export type UnderwritingStrategy = "LOA" | "SubTo" | "Wrap" | "Cash" | "Arbitrage";
export type DealNumbers = { purchasePrice?: number; arv?: number; repairs?: number; monthlyRent?: number; monthlyPiti?: number; monthlyPayment?: number; downPayment?: number; optionFee?: number; resalePrice?: number; monthlyExpenses?: number; occupancyRate?: number; assignmentFee?: number; interestRate?: number; amortizationMonths?: number; balloonMonths?: number };
const n = (v: number | undefined) => Number.isFinite(v) ? Number(v) : 0;
function payment(principal: number, annualRate: number, months: number) { const r = annualRate / 1200; return r === 0 ? principal / Math.max(months, 1) : principal * r / (1 - Math.pow(1 + r, -Math.max(months, 1))); }

export function underwriteDeal(strategy: UnderwritingStrategy, input: DealNumbers) {
  const p = n(input.purchasePrice), arv = n(input.arv), repairs = n(input.repairs), rent = n(input.monthlyRent), piti = n(input.monthlyPiti || input.monthlyPayment), down = n(input.downPayment || input.optionFee), expenses = n(input.monthlyExpenses), resale = n(input.resalePrice || arv), occupancy = Math.min(Math.max(n(input.occupancyRate || 1), 0), 1);
  const missing = [p <= 0 && "purchasePrice", arv <= 0 && "arv", strategy !== "Cash" && rent <= 0 && "monthlyRent"].filter(Boolean) as string[];
  let metrics: Record<string, number> = {};
  if (strategy === "Cash") { const allIn = p + repairs + n(input.assignmentFee); metrics = { allIn, grossProfit: resale - allIn, roi: allIn ? (resale - allIn) / allIn : 0, maxOffer75Arv: arv * .75 - repairs }; }
  if (strategy === "SubTo") { const cashFlow = rent - piti - expenses; metrics = { monthlyCashFlow: cashFlow, annualCashFlow: cashFlow * 12, entryCapital: down, debtCoverage: piti ? rent / piti : 0 }; }
  if (strategy === "Wrap") { const loan = Math.max(p - down, 0), sellerPayment = payment(loan, n(input.interestRate), n(input.amortizationMonths || 300)); const spread = rent - sellerPayment - expenses; metrics = { loanAmount: loan, monthlySellerPayment: sellerPayment, monthlySpread: spread, balloonBalance: loan * Math.pow(1 - (n(input.interestRate) / 1200), n(input.balloonMonths || 120)) }; }
  if (strategy === "LOA") { const cashFlow = rent - piti - expenses; metrics = { monthlySpread: cashFlow, optionFee: down, assignmentPotential: n(input.assignmentFee), exitPrice: resale, annualCashFlow: cashFlow * 12 }; }
  if (strategy === "Arbitrage") { const gross = rent * occupancy, net = gross - expenses - piti; metrics = { grossRevenue: gross, netCashFlow: net, breakEvenOccupancy: (expenses + piti) / Math.max(rent, 1), annualNet: net * 12 }; }
  const flags = [...missing]; if (arv > 0 && p + repairs > arv) flags.push("all-in cost exceeds ARV"); if (strategy !== "Cash" && metrics.monthlyCashFlow !== undefined && metrics.monthlyCashFlow < 0) flags.push("negative monthly cash flow");
  return { strategy, metrics, issueFlags: flags, manualReviewRequired: flags.length > 0, decision: flags.length ? "manual_review" : "pursue" };
}
