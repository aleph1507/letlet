import { resourceVehicle } from "./resourceVehicle";

export class VehicleBadge {
  id: number;
  permitNumber: number;
  returned: boolean;
  vehicle: resourceVehicle;
  expireDate: string;
  shreddigDate: string;
  deactivated: boolean;
  deactivatedReason: string;
  payment: string;
}
