import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap, take } from 'rxjs';
import { Reservation, ReservationStatus } from '../models/reservation.model';
import { AuthService } from './auth.service';
import { Projection } from '../models/projection.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservations = new BehaviorSubject<Reservation[]>([]);

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      this.reservations.next(JSON.parse(savedReservations));
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('reservations', JSON.stringify(this.reservations.value));
  }

  getReservationsForCurrentUser(): Observable<Reservation[]> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        return this.reservations.pipe(
          map(reservations => reservations.filter(r => r.userId === user.id))
        );
      })
    );
  }

  addReservation(projection: Projection, time: string): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (!user) {
        this.snackBar.open('Morate biti prijavljeni da biste rezervisali.', 'Zatvori', { duration: 3000 });
        return;
      }
      
      const currentReservations = this.reservations.value;
      const newReservation: Reservation = {
        id: Date.now(),
        userId: user.id,
        projection: projection,
        selectedTime: time,
        status: 'rezervisano'
      };
      
      this.reservations.next([...currentReservations, newReservation]);
      this.saveToLocalStorage();
      this.snackBar.open(`"${projection.title}" za ${time}h je dodato u korpu.`, 'Zatvori', { duration: 3000 });
    });
  }

  updateReservationStatus(reservationId: number, status: ReservationStatus): void {
    const updatedReservations = this.reservations.value.map(r => {
      if (r.id === reservationId) {
        return { ...r, status };
      }
      return r;
    });
    this.reservations.next(updatedReservations);
    this.saveToLocalStorage();
  }

  removeReservation(reservationId: number): void {
    const filteredReservations = this.reservations.value.filter(r => r.id !== reservationId);
    this.reservations.next(filteredReservations);
    this.saveToLocalStorage();
  }
  
  getTotalPriceForCurrentUser(): Observable<number> {
    return this.getReservationsForCurrentUser().pipe(
      map(reservations => reservations
        .filter(r => r.status === 'rezervisano')
        .reduce((sum, current) => sum + current.projection.price, 0))
    );
  }

  hasWatchedMovie(userId: number, projectionId: number): Observable<boolean> {
     return this.reservations.pipe(
        map(reservations => reservations.some(r => 
            r.userId === userId && 
            r.projection.id === projectionId && 
            r.status === 'gledano'
        ))
     );
  }
}