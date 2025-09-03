import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, switchMap, of, combineLatest, map } from 'rxjs';
import { Projection, Review } from '../../models/projection.model';
import { ProjectionService } from '../../services/projection.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { ReservationService } from '../../services/reservation.service';
import { User } from '../../models/user.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-projection-details',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatCardModule, MatDividerModule, MatFormFieldModule,
    MatInputModule, MatSelectModule
  ],
  templateUrl: './projection-details.component.html',
  styleUrls: ['./projection-details.component.css']
})
export class ProjectionDetailsComponent implements OnInit {
  projection$!: Observable<Projection | undefined>;
  canLeaveReview$!: Observable<boolean>;
  currentUser: User | null = null;
  reviewForm!: FormGroup;
  
  selectedTime = new FormControl('', [Validators.required]);

  constructor(
    private route: ActivatedRoute,
    private projectionService: ProjectionService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id$ = this.route.paramMap.pipe(map(params => Number(params.get('id'))));
    this.projection$ = id$.pipe(switchMap(id => this.projectionService.getProjectionById(id)));
    this.authService.currentUser$.subscribe(user => this.currentUser = user);

    this.canLeaveReview$ = combineLatest([this.authService.currentUser$, id$]).pipe(
      switchMap(([user, projectionId]) => {
        if (!user) return of(false);
        return this.reservationService.hasWatchedMovie(user.id, projectionId);
      })
    );

    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }

  reserve(projection: Projection): void {
     if (this.selectedTime.valid) {
        this.reservationService.addReservation(projection, this.selectedTime.value!);
     }
  }
  
  submitReview(): void {
    if (this.reviewForm.invalid || !this.currentUser) return;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const newReview: Review = {
      user: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      ...this.reviewForm.value
    };
    this.projectionService.addReview(id, newReview);
    this.snackBar.open('Hvala na recenziji!', 'Zatvori', { duration: 3000 });
    this.reviewForm.reset({ rating: 5, comment: '' });
  }
}