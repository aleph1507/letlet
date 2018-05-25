import { Company } from "./Company";

export interface Vehicle {
  id: number;
  company: Company;
  model: string;
  plate: string;
}
