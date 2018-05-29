import { Company } from "./Company";
import { Person } from "./Person.model";
import { VisitorBadge } from "./VisitorBadge";
import { Gate } from "./Gate";
import { Employee } from "./Employee";

export interface VisitPerson {
  id: number;
  company : Company;
  person : Person;
  visitorBadge : VisitorBadge;
  entryGate : Gate;
  entryEmployee : Employee;
  entryApprovedFrom : {
    'userName': string;
    'firstName': string;
    'lastName': string;
  }
  entryTime: string;
  exitGate: Gate;
  exitEmployee: Employee;
  exitApprovedFrom: {
    'userName': string;
    'firstName': string;
    'lastName': string;
  }
  exitTime: string;
  paid: boolean;
  billNumber: number;
}
