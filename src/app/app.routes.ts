import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProjectionDetailsComponent } from './components/projection-details/projection-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'projections/:id', component: ProjectionDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'cart', component: CartComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }, 
    { path: '**', redirectTo: '', pathMatch: 'full' }
];