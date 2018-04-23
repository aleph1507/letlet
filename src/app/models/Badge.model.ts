import {Person} from './Person.model';


export class Badge {
  id: number;
  company: string;
  personName: string;
  validTo: number;
  zones: number[];
  dateSecCheck: number;
  dateTraining: number;
}
