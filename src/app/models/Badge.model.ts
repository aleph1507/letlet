import { Employee } from './Employee';

export class Badge {
  id: number;
  cardSeriesNumber: number;
  cardNumber: number;
  // company: string;
  // personName: string;
  expireDate: number;
  active: boolean;
  returned: boolean;
  employeeId: number;
  employee: Employee;
  zones: number[];
  dateOfSecurityCheck: string;
  dateOfTraining: string;
  dateOfActivation: string;
}
