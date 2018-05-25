import { Company } from "./Company";

export interface Employee {
  id: number;
  name: string;
  surname: string;
  company: Company;
}
