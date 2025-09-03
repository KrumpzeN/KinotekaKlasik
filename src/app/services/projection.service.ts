import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Projection, Review } from '../models/projection.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectionService {

  private projections = new BehaviorSubject<Projection[]>([
    {
      id: 1,
      title: 'Kazablanka',
      description: 'Priča o ciničnom Amerikancu koji vodi noćni klub u Kazablanki tokom Drugog svetskog rata, rastrzan između ljubavi i dužnosti.',
      genre: ['Drama', 'Romansa', 'Ratni'],
      duration: 102,
      director: 'Michael Curtiz',
      actors: ['Humphrey Bogart', 'Ingrid Bergman'],
      year: 1942,
      releaseDate: '1942-11-26',
      projectionTimes: ['18:00', '20:00', '22:00'],
      price: 500,
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BY2IzZGY2YmEtYzljNS00NTM5LTgwMzUtMzM1NjQ4NGI0OTk0XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg',
      reviews: [{user: 'Pera Perić', rating: 5, comment: 'Vanvremenski klasik!'}],
      rating: 4.8
    },
    {
      id: 2,
      title: 'Kum',
      description: 'Patrijarh organizovane kriminalne porodice prenosi kontrolu nad svojim tajnim carstvom na svog nevoljnog sina.',
      genre: ['Krimi', 'Drama'],
      duration: 175,
      director: 'Francis Ford Coppola',
      actors: ['Marlon Brando', 'Al Pacino'],
      year: 1972,
      releaseDate: '1972-03-24',
      projectionTimes: ['19:00', '21:00'],
      price: 550,
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      reviews: [],
      rating: 4.9
    },
    {
      id: 3,
      title: 'Petparačke priče',
      description: 'Životi dva plaćena ubice, boksera, žene gangstera i para pljačkaša restorana isprepliću se u četiri priče o nasilju i iskupljenju.',
      genre: ['Krimi', 'Drama'],
      duration: 154,
      director: 'Quentin Tarantino',
      actors: ['John Travolta', 'Uma Thurman'],
      year: 1994,
      releaseDate: '1994-10-14',
      projectionTimes: ['20:30', '22:30'],
      price: 600,
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      reviews: [],
      rating: 4.7
    },
    {
      id: 4,
      title: '2001: Odiseja u svemiru',
      description: 'Nakon otkrića misterioznog artefakta zakopanog ispod Mesečeve površine, čovečanstvo kreće u potragu za njegovim poreklom.',
      genre: ['Avantura', 'Naučna fantastika'],
      duration: 149,
      director: 'Stanley Kubrick',
      actors: ['Keir Dullea', 'Gary Lockwood'],
      year: 1968,
      releaseDate: '1968-04-06',
      projectionTimes: ['19:30'],
      price: 500,
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMmNlYmJiZjUtYTc5NC00YjQ4LWE4MmUtMTM2ODk1NWM5NTVjXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      reviews: [],
      rating: 4.6
    },
    {
      id: 10,
      title: 'Dobri, loši, zli',
      description: 'Lovac na glave se udružuje sa dva revolveraša kako bi pronašli zakopano zlato Konfederacije usred nasilja i haosa Američkog građanskog rata.',
      genre: ['Vestern', 'Avantura'],
      duration: 178,
      director: 'Sergio Leone',
      actors: ['Clint Eastwood', 'Eli Wallach'],
      year: 1966,
      releaseDate: '1966-12-23',
      projectionTimes: ['19:00', '21:30'],
      price: 500,
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BNjJlYmNkZGItM2NhYy00MjlmLTk5NmQtNjg1NmM2ODU4OTMwXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg',
      reviews: [],
      rating: 4.5
    }
  ]);

  constructor() { }

  getProjections(): Observable<Projection[]> {
    return this.projections.asObservable();
  }

  getProjectionById(id: number): Observable<Projection | undefined> {
    return this.projections.pipe(
      map(projections => projections.find(p => p.id === id))
    );
  }

  searchProjections(term: string, genre: string, minRating: number, time: string): Observable<Projection[]> {
    return this.projections.pipe(
      map(projections => {
        const lowerCaseTerm = term.toLowerCase();
        return projections.filter(p => {
          const termMatch = p.title.toLowerCase().includes(lowerCaseTerm);
          const genreMatch = genre ? p.genre.includes(genre) : true;
          const ratingMatch = minRating > 0 ? p.rating >= minRating : true;
          const timeMatch = time ? p.projectionTimes.includes(time) : true;
          return termMatch && genreMatch && ratingMatch && timeMatch;
        });
      })
    );
  }

  getAvailableGenres(): Observable<string[]> {
    return this.projections.pipe(
        map(projections => {
            const allGenres = projections.flatMap(p => p.genre);
            return [...new Set(allGenres)].sort();
        })
    );
  }
  
  getAvailableTimes(): Observable<string[]> {
    return this.projections.pipe(
      map(projections => {
        const allTimes = projections.flatMap(p => p.projectionTimes);
        return [...new Set(allTimes)].sort((a,b) => a.localeCompare(b));
      })
    );
  }

  addReview(projectionId: number, review: Review): void {
    const currentProjections = this.projections.value;
    const updatedProjections = currentProjections.map(p => {
      if (p.id === projectionId) {
        const newReviews = [...p.reviews, review];
        const newRating = (p.rating * p.reviews.length + review.rating) / newReviews.length;
        return { ...p, reviews: newReviews, rating: parseFloat(newRating.toFixed(1)) };
      }
      return p;
    });
    this.projections.next(updatedProjections);
  }
}