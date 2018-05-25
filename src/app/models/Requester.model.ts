import { Person } from './Person.model';
import { Vehicle } from './Vehicle.model';
import { Company } from './Company';

export class Requester {
  requestID: number;
  requesterName: string;
  description: string;
  company: Company;
  from: Date;
  to: Date;
  numEntries: number;
  persons: Person[];
  vehicles: Vehicle[];
  date: number;
}
