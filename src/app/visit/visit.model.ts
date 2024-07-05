import { User } from './user.model'
import {Prescription} from '../prescriptions/prescription.model'

export interface Visit {
  id: number;
  date: string;
  hour: string;
  note: string;
  user: User;
  prescriptions: Prescription[];
}
