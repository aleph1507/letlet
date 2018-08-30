import { Company } from "./Company";

export interface resourceVehicle {
  id: number;
  company: Company
  model: string;
  plate: string;
}
