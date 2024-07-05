import {Visit} from "../visit/visit.model";

export interface Prescription {
  id?: number;
  telephone: string;
  note: string;
  visit: Visit;

}
