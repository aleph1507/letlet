import { Employee } from './Employee';
import { AirportZone } from './AirportZone';

export class Badge {
  id: number;
  cardSeriesNumber: number;
  cardNumber: number;
  badgeNumber: number;
  expireDate: string;
  active: boolean;
  returned: boolean;
  employeeId: number;
  employee: Employee;
  zones;
  dateOfSecurityCheck: string;
  dateOfTraining: string;
  dateOfActivation: string;
  deactivated: boolean;
  deactivatedReadon: string;
  payment: string;
}
