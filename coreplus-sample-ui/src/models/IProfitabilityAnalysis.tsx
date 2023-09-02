import { IRevenueByCostPerMonth } from "./IRevenueByCostPerMonth";

export interface IProfitabilityAnalysis {
  practitioner_id: number;
  revenueByCostPerMonth: IRevenueByCostPerMonth[];
}
