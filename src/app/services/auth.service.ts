import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router, private snackBar: MatSnackBar) {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
    
    const loggedInUser = sessionStorage.getItem('currentUser');
    if(loggedInUser) {
        this.currentUserSubject.next(JSON.parse(loggedInUser));
    }
  }

  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  register(user: Omit<User, 'id'>): void {
    const newUser: User = { ...user, id: Date.now() };
    this.users.push(newUser);
    this.saveUsersToLocalStorage();
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userToStore } = user;
      sessionStorage.setItem('currentUser', JSON.stringify(userToStore));
      this.currentUserSubject.next(userToStore);
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  updateUser(updatedData: Omit<User, 'id' | 'password'>): void {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return;

    const userIndex = this.users.findIndex(u => u.id === currentUser.id);
    if (userIndex > -1) {
      this.users[userIndex] = { 
        ...this.users[userIndex], 
        ...updatedData 
      };
      this.saveUsersToLocalStorage();

      const updatedUserForSession = { ...currentUser, ...updatedData };
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUserForSession));
      this.currentUserSubject.next(updatedUserForSession);
      
      this.snackBar.open('Profil je uspešno ažuriran!', 'Zatvori', { duration: 3000 });
    }
  }
}