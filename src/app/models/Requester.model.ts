import { Person } from './Person.model';
import { Vehicle } from './Vehicle.model';
// import { Company } from './Company';

export class Requester {
  id: number;
  requesterName: string;
  description: string;
  companyId: number;
  fromDate: Date;
  toDate: Date;
  numberOfEntries: number;
  requestPersonJson: Person[];
  requestVehicleJson: Vehicle[];
  // date: number;
}
