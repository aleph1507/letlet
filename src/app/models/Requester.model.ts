import { Person } from './Person.model';
import { Vehicle } from './Vehicle.model';

export class Requester {
  requestID: number;
  requesterName: string;
  description: string;
  company: string;
  from: Date;
  to: Date;
  numEntries: number;
  persons: Person[];
  vehicles: Vehicle[];
  date: number;
}
