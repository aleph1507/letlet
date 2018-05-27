import { Company } from "./Company";

export interface Employee {
  id: number;
  name: string;
  surname: string;
  occupation: string;
  company: Company;
}
