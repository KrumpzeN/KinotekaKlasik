import { Projection } from './projection.model';

export type ReservationStatus = 'rezervisano' | 'gledano' | 'otkazano';

export interface Reservation {
  id: number;
  userId: number;
  projection: Projection;
  selectedTime: string; 
  status: ReservationStatus;
  userRating?: number;
}