import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Observable } from 'rxjs';
import { Reservation, ReservationStatus } from '../../models/reservation.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { ThemePalette } from '@angular/material/core'; 

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  reservations$!: Observable<Reservation[]>;
  totalPrice$!: Observable<number>;

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.reservations$ = this.reservationService.getReservationsForCurrentUser();
    this.totalPrice$ = this.reservationService.getTotalPriceForCurrentUser();
  }

  updateStatus(reservationId: number, status: ReservationStatus): void {
    this.reservationService.updateReservationStatus(reservationId, status);
  }

  removeReservation(reservationId: number): void {
    this.reservationService.removeReservation(reservationId);
  }

  getStatusColor(status: ReservationStatus): ThemePalette {
    switch(status) {
      case 'rezervisano': return 'primary';
      case 'gledano': return 'accent';
      case 'otkazano': return 'warn';
      default: return undefined;
    }
  }
}