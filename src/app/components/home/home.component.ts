import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { Projection } from '../../models/projection.model';
import { ProjectionService } from '../../services/projection.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, MatCardModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatChipsModule, MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  projections$!: Observable<Projection[]>;
  genres$!: Observable<string[]>;
  times$!: Observable<string[]>;

  searchTerm = new FormControl('');
  selectedGenre = new FormControl('');
  selectedRating = new FormControl(0);
  selectedTime = new FormControl('');

  constructor(private projectionService: ProjectionService) { }

  ngOnInit(): void {
    this.genres$ = this.projectionService.getAvailableGenres();
    this.times$ = this.projectionService.getAvailableTimes();

    const search$ = this.searchTerm.valueChanges.pipe(startWith(''), debounceTime(300));
    const genre$ = this.selectedGenre.valueChanges.pipe(startWith(''));
    const rating$ = this.selectedRating.valueChanges.pipe(startWith(0));
    const time$ = this.selectedTime.valueChanges.pipe(startWith(''));

    this.projections$ = combineLatest([search$, genre$, rating$, time$]).pipe(
      switchMap(([term, genre, rating, time]) =>
        this.projectionService.searchProjections(term || '', genre || '', rating || 0, time || '')
      )
    );
  }
}