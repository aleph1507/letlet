import { Company } from "./Company";
import { Person } from "./Person.model";
import { Vehicle } from "./Vehicle.model";

export interface RequestReport {
  approved: boolean,
  company: Company,
  companyId: number,
  contactEmail: string,
  contactPhone: string,
  description: string,
  descriptionEn: string,
  fromDate: string,
  id: number,
  numberOfEntries: number,
  requestPersonJson: Person[],
  requestVehicleJson: Vehicle[],
  requesterName: string,
  toDate: string
}
