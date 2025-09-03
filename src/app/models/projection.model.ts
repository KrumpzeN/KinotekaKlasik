export interface Review {
  user: string;
  rating: number;
  comment: string;
}

export interface Projection {
  id: number;
  title: string;
  description: string;
  genre: string[];
  duration: number; 
  director: string;
  actors: string[];
  year: number;
  releaseDate: string;
  projectionTimes: string[]; 
  price: number;
  posterUrl: string;
  reviews: Review[];
  rating: number; 
  
}